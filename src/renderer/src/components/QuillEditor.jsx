import { Slider } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { bloomCollection, symspellDict } from '../../../shared/config.js'
import Tooltip from '../components/editor/Tooltip'
import { modules } from '../constants/editorModules'
import { formats } from '../constants/formats'
import { useContent } from '../hooks/ContentProvider'
import { cleanWord, getWordAtPosition, underlineWordInEditor } from '../services/editorService'
import { ignoreSingleChars, isSingleCharacter } from '../services/editorUtils'
import { addToDictionary, ignoreAll, replaceWord } from '../services/toolTipOperations.js'
import { getWrongWords, loadBloomFilter } from '../spellcheck/bloomFilter'
import SymSpellService from '../spellcheck/symspell'
import Page from './Page'
import QuillToolbar from './toolbar/QuillToolbar'
import LoadingComponent from './utils/LoadingComponent.jsx'
import StartAppLoading from './utils/StartAppLoading'
const QuillEditor = () => {
  const [content, setContent] = useState('')
  const [pages, setPages] = useState([0])
  const [pageSize, setPageSize] = useState({ width: 816, height: 1056 }) // Default A4 size
  const quillRef = useRef(null)
  const debounceTimerRef = useRef(null)
  const [mouseDown, setMouseDown] = useState(false) // Track if mouse is down
  const [zoom, setZoom] = useState(100) // Initial zoom level

  const [wrongwords, setWrongWords] = useState([])
  const [suggestions, setSuggestions] = useState({})
  const [clickedWord, setClickedWord] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({})
  const [replacementWord, setReplacementWord] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // For loading state
  const [bloomFilter, setBloomFilter] = useState(null) // State to store BloomFilter
  const [currentWorkingDir, setCurrentWorkingDir] = useState('')
  const [isnormalLoading, setIsNormalLoading] = useState(false)
  const [lastPageNumber, SetlastPageNumber] = useState(0)
  const specialChars = '!@#$%^&*()_+[]{}|;:\',.<>/?~-=\\"'
  const [symSpell, setSymSpell] = useState(null)

  const { filecontent } = useContent()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cwd = await window.electronAPI.getCwd()
        if (cwd && cwd.trim()) {
          setCurrentWorkingDir(cwd) // Set the current working directory
        }
      } catch (error) {
        console.error('Error fetching current working directory:', error)
        setIsLoading(false) // Stop loading in case of an error
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    //if (!currentWorkingDir) return // If no working directory, skip the logic

    const loadFilterAndDict = async () => {
      const bloomDictPath = bloomCollection //`${currentWorkingDir}/${bloomCollection}`
      const symspellDictPath = symspellDict //`${currentWorkingDir}/${symspellDict}`

      const size = 100000 // Define the size of the Bloom Filter
      const errorRate = 0.001 // Define the error rate

      try {
        console.log(`Starting to load Bloom Filter from: ${bloomDictPath}`)
        console.log(`Expected Bloom Filter size: ${size}, Error rate: ${errorRate}`)

        const filter = await loadBloomFilter(bloomDictPath, size, errorRate)
        setBloomFilter(filter) // Set the BloomFilter in state
        console.log('Bloom Filter loaded successfully.')

        // Load SymSpell service
        const symSpellService = new SymSpellService()
        await symSpellService.loadSymSpell(symSpellService, symspellDictPath)
        setSymSpell(symSpellService)
        console.log('Successfully loaded SymSpell service from:', symspellDictPath)
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to load resources:', err)
      }
    }

    loadFilterAndDict()
  }, [])

  useEffect(() => {
    paginateContent()
  }, [content, pageSize])

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.getEditor().root.setAttribute('spellcheck', 'false')
    }
  }, [])
  // useEffect(() => {
  //   setContent(filecontent)
  //   console.log('filecontent', filecontent)
  // }, [filecontent])

  const handleChange = (value) => {
    setContent(value)
  }

  const handleZoomChange = (event, newValue) => {
    setZoom(newValue)
  }

  const paginateContent = () => {
    const editor = quillRef?.current?.getEditor()
    const editorContent = editor.root
    const contentHeight = editorContent.scrollHeight
    const requiredPages = Math.ceil(contentHeight / pageSize.height)

    setPages(Array.from({ length: requiredPages }, (_, i) => i))
  }

  useEffect(() => {
    const fetchWrongWords = async () => {
      const quill = quillRef.current?.getEditor()
      if (quill && bloomFilter) {
        try {
          const wrongWordList = await getWrongWords(quill, bloomFilter)
          //console.log("wrongwords", wrongWordList);
          if (wrongWordList) {
            const removedSinglechar = ignoreSingleChars(wrongWordList)
            // Underline new errors in the editor
            removedSinglechar.forEach((word) => underlineWordInEditor(quill, word))
            // Update the errors state
            setWrongWords(removedSinglechar)
          }
        } catch (error) {
          console.error('Error fetching wrong words:', error)
        }
      }
    }

    fetchWrongWords()
  }, [])

  useEffect(() => {
    const quill = quillRef.current?.getEditor()

    const handleMouseDown = () => {
      setMouseDown(true) // Mouse is down
    }

    const handleMouseUp = () => {
      setMouseDown(false) // Mouse is up
    }

    const handleSelectionChange = async (range, source) => {
      // Only execute if mouse was clicked
      if (mouseDown && range && range.length === 0) {
        const fullText = quill.getText()
        const word = cleanWord(getWordAtPosition(fullText, range.index))

        if (word) {
          if (wrongwords.includes(word)) {
            try {
              const suggestionList = await symSpell.getSuggestions(word)
              setClickedWord(word)
              // Assuming the suggestionList is an array of suggestion objects
              setSuggestions((prevSuggestions) => ({
                ...prevSuggestions,
                [word]: suggestionList.map((suggestion) => suggestion.term) // Extracting only the 'term' from each suggestion
              }))

              const bounds = quill.getBounds(range.index)
              setTooltipPosition({
                top: bounds.bottom + 90,
                left: bounds.left
              })
            } catch (error) {
              console.error('Error fetching suggestions:', error)
            }
          } else {
            setClickedWord(null)
          }
        }
      }
    }

    // Attach event listeners for mouse events
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    quill.on('selection-change', handleSelectionChange)

    // Cleanup listeners on component unmount
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      quill.off('selection-change', handleSelectionChange)
    }
  }, [wrongwords, mouseDown])

  let addZWNJOnNextBackspace = false // Flag to track if ZWNJ should be added on the next deletion

  const handleKeyDown = async (e) => {
    const quill = quillRef.current.getEditor()
    const range = quill.getSelection()

    if (e.key === ' ') {
      // Debounce logic
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(async () => {
        if (range) {
          const currentText = quill.getText(0, range.index).trim()
          const words = currentText.split(/\s+/)
          let lastWord = words[words.length - 1]
            .split('')
            .filter((char) => !specialChars.includes(char))
            .join('')
          if (isSingleCharacter(lastWord)) return

          if (wrongwords.includes(cleanWord(lastWord))) {
            underlineWordInEditor(quill, lastWord)
          } else if (lastWord && !/^[a-zA-Z0-9]+$/.test(lastWord)) {
            const isContained = await bloomFilter.contains(lastWord) // returns true or false

            if (!isContained) {
              setWrongWords((prevErrors) => [...prevErrors, lastWord])
              underlineWordInEditor(quill, lastWord)
            }
          }
        }
      }, 300) // Adjust debounce time as needed
    } else if (e.key === 'Backspace') {
      //e.preventDefaut()

      if (range && range.index > 0) {
        const cursorPosition = range.index
        const textBeforeCursor = quill.getText(0, cursorPosition)
        const charBeforeCursor = textBeforeCursor.charAt(cursorPosition - 1)
        const charCode = charBeforeCursor.charCodeAt(0) // Get the Unicode value

        console.log(`Character to be deleted: ${charBeforeCursor}`)

        console.log(`Unicode code point: U+${charCode.toString(16).toUpperCase()}`)

        const unicodechar = `U+${charCode.toString(16)}`

        console.log(`Unicode code point: ${unicodechar}`)
        // Delete the character before the cursor
        quill.deleteText(cursorPosition - 1, 1)

        console.log(`Deleted character: ${charBeforeCursor}`)

        // Detect Kannada complex characters like Halanth or dependent vowels
        if (charBeforeCursor === '್' || unicodechar === 'U+cbe') {
          // Insert ZWNJ at the current cursor position
          quill.insertText(cursorPosition + 1, '\u200C')
          console.log(`Inserted ZWNJ (\u200C) at position ${cursorPosition - 1}`)
        }
      }
    }
  }

  const handleSuggestionReplace = (replacement) => {
    // Update errors and clickedWord state
    replaceWord({ quillRef, replacement, clickedWord })
    setWrongWords(wrongwords.filter((word) => word !== clickedWord))
    setClickedWord(null)
  }

  const handleAddToDictionary = async () => {
    if (clickedWord) {
      setIsLoading
      try {
        // Optimistic UI update: remove the word from wrongWords and reset clickedWord
        setWrongWords((prevWrongWords) => prevWrongWords.filter((word) => word !== clickedWord))
        setClickedWord(null)

        // Concurrently add to both dictionaries
        const wordWithFreq = `${clickedWord} 10` // Example frequency
        const [isAdded, addtoSymspell] = await Promise.all([
          addToDictionary(bloomCollection, clickedWord), // Add to the main dictionary
          addToDictionary(symspellDict, wordWithFreq) // Add to symspell dictionary with frequency
        ])

        // If both operations succeeded, update the UI
        if (isAdded && addtoSymspell) {
          // Call ignoreAll to mark the word as ignored
          ignoreAll({ quillRef, clickedWord })
        } else {
          // Handle failure if needed (e.g., show error message to user)
          console.error('Failed to add word to dictionary')
          setClickedWord(clickedWord) // Restore clickedWord if needed
        }
      } catch (error) {
        console.error('Error adding word to dictionary:', error)
        // Optionally, show an error message to the user
      }
    }
  }

  const replaceAll = () => {
    if (clickedWord) {
      setIsModalOpen(true)
    }
  }

  const handleReplaceAll = () => {
    const replacement = replacementWord
    replaceWord({ quillRef, replacement, clickedWord })
    // Reset modal and state
    setIsModalOpen(false)
    setClickedWord(null)
    setReplacementWord('')
  }

  const handleIgnoreAll = () => {
    ignoreAll({ quillRef, clickedWord })
    setClickedWord(null)
    setWrongWords(wrongwords.filter((word) => word !== clickedWord))
  }

  const handleInputClick = (e) => {
    e.target.focus() // Focus the input when clicked
  }

  const updateWrongWords = (words) => {
    setWrongWords(words) // Update wrong words state in the parent component
  }
  // Call SetlastPageNumber once after the pages array is processed
  useEffect(() => {
    if (pages.length > 0) {
      SetlastPageNumber(pages[pages.length - 1])
    }
  }, [pages])
  return (
    <div className="editor-container">
      {isnormalLoading && <LoadingComponent />}
      <div className="editor-toolbar-container">
        <QuillToolbar
          quillRef={quillRef}
          setPageSize={setPageSize}
          bloomFilter={bloomFilter}
          setWrongWords={updateWrongWords}
        />
      </div>
      <div className="editor-wrapper">
        <div className="relative">
          {pages.map((pageIndex, idx) => (
            <Page
              key={pageIndex}
              pageIndex={pageIndex}
              isLast={idx === pages.length - 1}
              pageSize={pageSize}
            />
          ))}
        </div>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          modules={modules}
          formats={formats}
          style={{
            width: `${pageSize.width}px`,
            minHeight: `${pageSize.height}px`,
            zoom: `${zoom}%`
          }}
          className="quill-editor"
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center p-4 bg-gray-100 z-50">
        <div className="text-sm text-gray-700">Page {lastPageNumber + 1}</div>
        <div className="flex items-center space-x-2">
          <label htmlFor="zoom" className="text-sm text-gray-700">
            Zoom:
          </label>
          <Slider
            value={zoom}
            min={50}
            max={200}
            step={10}
            onChange={handleZoomChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
            sx={{ width: 150 }}
          />
          <span className="text-sm text-gray-700">{zoom}%</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-300 p-4 rounded shadow-lg w-11/12 max-w-sm mx-auto">
            <h5 className="mb-2">Replace {clickedWord} with:</h5>
            <input
              type="text"
              autoFocus
              value={replacementWord}
              onChange={(e) => setReplacementWord(e.target.value)}
              onClick={handleInputClick}
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Replacement word"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleReplaceAll}
                className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 ${
                  !replacementWord.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!replacementWord.trim()}
              >
                Replace All
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {clickedWord && suggestions[clickedWord] && (
        <Tooltip
          clickedWord={clickedWord}
          suggestions={suggestions}
          tooltipPosition={tooltipPosition}
          setClickedWord={setClickedWord}
          replaceWord={handleSuggestionReplace}
          addDictionary={handleAddToDictionary}
          replaceAll={replaceAll}
          ignoreAll={handleIgnoreAll}
        />
      )}

      {/* {isLoading && <LoadingComponent />} */}
      {isLoading && <StartAppLoading />}
    </div>
  )
}

export default QuillEditor
