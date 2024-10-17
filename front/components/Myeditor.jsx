import React, { useEffect, useRef } from 'react'

const createUploadAdapter = (loader) => {
  const upload = () => {
    return loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData()
          formData.append('articleImage', file)
          fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
            .then((response) => {
              console.log(response)
              return response.json()
            })
            .then((result) => {
              console.log(`上傳圖片的url : ${result.url}`)
              resolve({
                default: result.url,
              })
            })
            .catch(reject)
        })
    )
  }

  return {
    upload,
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return createUploadAdapter(loader)
  }
}

// 文章編輯器
const Myeditor = ({ onChange, editorLoaded, name, value }) => {
  const editorRef = useRef()
  const { CKEditor, ClassicEditor } = editorRef.current || {}

  // 動態加載 CKEditor 和 ClassicEditor
  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    }
  }, [])

  return (
    <>
      {editorLoaded ? (
        <CKEditor
          type=""
          name={name}
          editor={ClassicEditor}
          data={value}
          onChange={(event, editor) => {
            const data = editor.getData()
            onChange(data)
          }}
          config={{
            extraPlugins: [MyCustomUploadAdapterPlugin],
          }}
        />
      ) : (
        <div>loading</div>
      )}
    </>
  )
}

export default Myeditor
