<!-- lib/components/FileUploader.svelte -->
<script lang="ts">
  import { files, fileSelected } from '$lib/stores'
  import { get } from 'svelte/store'

  let dropActive = false
  let fileInput: HTMLInputElement

  const getFileIcon = (file: File): string => {
    if (file.type.startsWith('video/')) return 'videocam'
    if (file.type.startsWith('audio/')) return 'music_note'
    if (file.type.startsWith('image/')) return 'image'
    return 'description'
  }

  async function generateThumbnail(file: File): Promise<string | null> {
    if (!file.type.startsWith('video/')) return null
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file)
      const video = document.createElement('video')
      video.src = url
      video.onloadedmetadata = () => {
        video.currentTime = video.duration / 2
      }
      video.onseeked = () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(url)
        resolve(canvas.toDataURL('image/png'))
      }
      video.onerror = () => {
        URL.revokeObjectURL(url)
        reject('Thumbnail generation failed')
      }
    })
  }

  async function fileInfo(fileList: FileList | File[]) {
    const filesNew = await Promise.all(
      Array.from(fileList).map(async (file) => {
        const thumb = file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : await generateThumbnail(file)

        return {
          id: crypto.randomUUID(),
          file,
          icon: thumb ? '' : getFileIcon(file),
          thumb,
        }
      }),
    )

    files.update((current) => [...current, ...filesNew])
    fileSelected.set(get(files).length > 0 ? 0 : -1)
    if (fileInput) fileInput.value = ''
  }

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    dropActive = false
    if (e.dataTransfer?.files.length) {
      await fileInfo(e.dataTransfer.files)
    }
  }
</script>

<svelte:window
  on:dragover={(e) => {
    e.preventDefault()
    dropActive = true
  }}
  on:dragleave={(e) => {
    e.preventDefault()
    dropActive = false
  }}
  on:drop={handleDrop}
/>

<button
  type="button"
  on:click={() => fileInput.click()}
  class="border-mild flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-6 transition-colors duration-300 {dropActive
    ? 'border-primary/50 bg-primary/20'
    : 'bg-transparent'}"
>
  <span class="material-icons text-dark/50 mb-2" style="font-size: 2rem;">attach_file</span>
  <p class="text-dark/70 text-center">Drag & drop files or click here</p>
  <input
    type="file"
    multiple
    accept="*/*"
    class="hidden"
    bind:this={fileInput}
    on:change={(e) => fileInfo((e.target as HTMLInputElement).files!)}
  />
</button>
