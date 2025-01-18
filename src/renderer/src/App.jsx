import QuillEditor from './components/QuillEditor'
import { ContentProvider } from './hooks/ContentProvider'
const App = () => {
  return (
    <>
      <ContentProvider>
        <QuillEditor />
      </ContentProvider>
    </>
  )
}

export default App
