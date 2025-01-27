import BackupTableIcon from '@mui/icons-material/BackupTable'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import RedoIcon from '@mui/icons-material/Redo'
import RefreshIcon from '@mui/icons-material/Refresh'
import SaveIcon from '@mui/icons-material/Save'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop'
import SettingsIcon from '@mui/icons-material/Settings'
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import UndoIcon from '@mui/icons-material/Undo'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ICON_LABELS_KANNADA } from '../../constants/formats'
import { FONT_SIZES, FONTS } from '../../constants/Nudifonts'
import { PAGE_SIZES } from '../../constants/pageSizes'
import { useContent } from '../../hooks/ContentProvider'
import { openFile, refreshAndGetWrongWords } from '../../services/toolbarFunctions'
import ConfigPathForm from '../utils/ConfigPathForm'
import ConfirmationModal from '../utils/ConfirmationModal'
import FileSave from '../utils/FileSave'
import InformationModal from '../utils/InformationModal'
import LoadingComponent from '../utils/LoadingComponent'
import CustomSizeDialog from './CustomSizeDialog'
import SearchModal from './SearchModal'

export const QuillToolbar = ({ quillRef, setPageSize, bloomFilter, setWrongWords }) => {
  const [pageSizeOption, setPageSizeOption] = useState('A4')
  const [prevPageSize, setPrevPageSize] = useState('A4')
  const [openModal, setOpenModal] = useState(false)
  const [fontOption, setFontOption] = useState(FONTS[0])
  const [sizeOption, setSizeOption] = useState(FONT_SIZES[2])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [saveContent, setsaveContent] = useState('')

  const [zoomLevel, setZoomLevel] = useState(1)
  const [searchWord, setSearchWord] = useState('')
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [searchModal, setsearchModal] = useState(false)
  const [confirmModalOpen, setconfirmModalOpen] = useState(false)
  const [filesaveModalOpen, setfilesaveModalOpen] = useState(false)
  const [showConfigForm, setShowConfigForm] = useState(false)
  const openSearchModal = () => setsearchModal(true)
  const closeSearchModal = () => setsearchModal(false)

  const handleinfoOpenModal = () => setInfoModalOpen(true)
  const handleinfoCloseModal = () => setInfoModalOpen(false)

  const handlefilesaveModalClose = () => setfilesaveModalOpen(false)
  const handlefilesaveModalOpen = () => setfilesaveModalOpen(true)

  const { setFilecontent } = useContent()

  useEffect(() => {
    if (filesaveModalOpen) {
      const content = getEditorContent()
    }
  }, [filesaveModalOpen]) // This effect will run whenever filesaveModalOpen changes

  const handlePageSizeChange = (e) => {
    const selectedSize = e.target.value
    setPageSizeOption(selectedSize)
    if (selectedSize === 'Custom') {
      setPrevPageSize(pageSizeOption)
      setOpenModal(true)
    } else {
      const size = PAGE_SIZES[selectedSize]
      setPageSize(size)
    }
  }

  const handleFontChange = (e) => {
    const selectedFont = e.target.value
    setFontOption(selectedFont)
    const editor = quillRef?.current.getEditor()
    if (editor) {
      editor.format('font', selectedFont)
    }
  }

  const handleSizeChange = (e) => {
    const selectedSize = e.target.value
    setSizeOption(selectedSize)
    const editor = quillRef?.current?.getEditor()
    if (editor) {
      editor.format('size', selectedSize)
    }
  }

  const applyCustomSize = (customSize) => {
    if (customSize.width && customSize.height) {
      setPageSize({
        width: customSize.width,
        height: customSize.height
      })
      setOpenModal(false)
    }
  }
  const spellcheckInfo = async () => {
    const info = 'spellcheck information not yet Added! please keep visiting official website!'
    setMessage(info)
    setInfoModalOpen(true)
  }

  const handleVoiceToText = async () => {
    try {
      const voiceToTextInfo =
        'ಧ್ವನಿಯಿಂದ ಪಠ್ಯದ ಕಾರ್ಯವು ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲ. ಇತ್ತೀಚಿನ ನವೀಕರಣಗಳಿಗಾಗಿ ದಯವಿಟ್ಟು ನಮ್ಮ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಭೇಟಿ ನೀಡಿ'
      setMessage(voiceToTextInfo)
      //const result = await window.electronAPI.startSpeechRecognition()
      setInfoModalOpen(true)
    } catch (error) {
      console.error('Error while starting speech recognition:', error)
    }
  }

  const handleSpellcheck = async () => {
    // Force a re-render to show loading immediately
    setIsLoading(true)

    // This ensures that the loading state updates first before the async operation begins
    setTimeout(async () => {
      try {
        const wrongwords = await refreshAndGetWrongWords({ quillRef, bloomFilter })
        setWrongWords(wrongwords) // Update the wrong words state in Editor
      } catch (error) {
        console.error('Error during spellcheck:', error)
      } finally {
        // Once the async task completes, set loading to false
        setIsLoading(false)
      }
    }, 0) // Running the async logic after the state update
  }

  const handleCloseModal = () => {
    setPageSizeOption(prevPageSize)
    setOpenModal(false)
  }

  // Zoom In
  const handleZoomIn = () => {
    setZoomLevel((prev) => prev + 0.1)
    window.electronAPI.zoomIn()
  }

  // Zoom Out
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.1, prev - 0.1))
    window.electronAPI.zoomOut()
  }

  // Reset Zoom
  const handleResetZoom = () => {
    setZoomLevel(1)
    window.electronAPI.resetZoom()
  }

  const handleFindword = () => {
    if (searchWord.trim()) {
      window.electronAPI.searchInWindow(searchWord) // Send search request to main process
    } else {
      console.log('Search input is empty')
    }
  }

  const handleFileOpen = async () => {
    // Set loading state to true immediately
    setIsLoading(true)
    try {
      // Retrieve the window title
      const windowTitle = await window.electronAPI.getWindowTitle() // Await the promise here
      console.log('windowTitle', windowTitle)

      // Check if the title is "Untitled"
      if (windowTitle !== 'Untitled') {
        setconfirmModalOpen(true) // Open the confirmation modal
      } else {
        // Directly open the file if the title is "Untitled"
        await openFileOperation()
      }
    } catch (error) {
      console.error('Error getting window title:', error)
      setIsLoading(false) // Reset loading state even if there's an error
    }
  }

  const handleConfirm = async () => {
    console.log('Action confirmed')
    setconfirmModalOpen(false) // Close the modal
    await openFileOperation() // Call openFile after confirmation
  }

  const handleConfirmCancel = () => {
    console.log('Action canceled')
    setconfirmModalOpen(false) // Close the modal
    setIsLoading(false)
  }

  const openFileOperation = async () => {
    // Use setTimeout to ensure the loading state is rendered first
    setTimeout(async () => {
      try {
        const content = await openFile() // Perform the file opening operation
        setFilecontent(content)
      } catch (error) {
        console.error('Error opening file:', error)
      } finally {
        // Reset loading state to false once the async operation is done
        setIsLoading(false)
      }
    }, 0) // Trigger async operation after state update
  }

  const getEditorContent = () => {
    const editorContent = document.querySelector('.ql-editor').innerHTML
    if (editorContent) {
      const data = editorContent
      setsaveContent(data)

      return data
    }
    return ''
  }

  const handleOpenConfigForm = () => {
    setShowConfigForm(true);
  };

  const handleCloseConfigForm = () => {
    setShowConfigForm(false);
  };

  return (
    <>
      {isLoading && <LoadingComponent />}
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={handleConfirmCancel}
        onConfirm={handleConfirm}
        message="ಹೊಸ ಫೈಲ್ ತೆರೆಯುವ ಮೊದಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಕೆಲಸವನ್ನು ಉಳಿಸಿ. ಹೊಸ ಫೈಲ್ ತೆರೆಯುವುದರಿಂದ ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಫೈಲ್ ಅನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಮುಚ್ಚಲಾಗುತ್ತದೆ"
      />

      <FileSave
        open={filesaveModalOpen}
        handleClose={handlefilesaveModalClose}
        htmlContent={saveContent}
      />

      <div id="toolbar" className="flex flex-wrap gap-4 p-4">
        <div>
          <span className="settings">
            <button title={'Settings'} onClick={handleOpenConfigForm}>
              <SettingsIcon />
            </button>
          </span>
          <ConfigPathForm open={showConfigForm} onClose={handleCloseConfigForm} />
        </div>

        <span className="ql-formats">
          <button className="ql-open" title={ICON_LABELS_KANNADA.open} onClick={handleFileOpen}>
            <FolderOpenIcon />
          </button>
        </span>
        <span className="ql-formats">
          <button className="ql-save " title={ICON_LABELS_KANNADA.save}>
            <SaveIcon style={{ fontSize: 40 }} />
          </button>
        </span>
        <span className="ql-formats">
          <button
            className="ql-saveAs "
            title={ICON_LABELS_KANNADA.save}
            onClick={handlefilesaveModalOpen}
          >
            <SaveAsIcon style={{ fontSize: 40 }} />
          </button>
        </span>

        <span className="ql-formats">
          <select
            className="ql-font"
            value={fontOption}
            onChange={handleFontChange}
            title={ICON_LABELS_KANNADA.font}
          >
            {FONTS.map((font, index) => (
              <option key={index} value={font}>
                {font}
              </option>
            ))}
          </select>

          <select
            className="ql-size"
            value={sizeOption}
            onChange={handleSizeChange}
            title={ICON_LABELS_KANNADA.fontSize}
          >
            {FONT_SIZES.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>

          <select className="ql-header" defaultValue="3" title={ICON_LABELS_KANNADA.headline}>
            <option value="1">Heading</option>
            <option value="2">Subheading</option>
            <option value="3">Normal</option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold" title={ICON_LABELS_KANNADA.bold} />
          <button className="ql-italic" title={ICON_LABELS_KANNADA.italic} />
          <button className="ql-underline" title={ICON_LABELS_KANNADA.underline} />
          <button className="ql-strike" title={ICON_LABELS_KANNADA.strike} />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" title={ICON_LABELS_KANNADA.listOrdered} />
          <button className="ql-list" value="bullet" title={ICON_LABELS_KANNADA.listBullet} />
          <button className="ql-indent" value="-1" title={ICON_LABELS_KANNADA.indentDecrease} />
          <button className="ql-indent" value="+1" title={ICON_LABELS_KANNADA.indentIncrease} />
        </span>
        <span className="ql-formats">
          <button className="ql-script" value="super" title={ICON_LABELS_KANNADA.superscript} />
          <button className="ql-script" value="sub" title={ICON_LABELS_KANNADA.subscript} />
          <button className="ql-blockquote" title={ICON_LABELS_KANNADA.blockquote} />
          <button className="ql-direction" title={ICON_LABELS_KANNADA.direction} />
        </span>
        <span className="ql-formats">
          <select className="ql-align" title={ICON_LABELS_KANNADA.align} />
          <select className="ql-color" title={ICON_LABELS_KANNADA.color} />
          <select className="ql-background" title={ICON_LABELS_KANNADA.background} />
        </span>
        <span className="ql-formats">
          <button className="ql-link" title={ICON_LABELS_KANNADA.link} />
          <button className="ql-image" title={ICON_LABELS_KANNADA.image} />
          <button className="ql-video" title={ICON_LABELS_KANNADA.video} />
        </span>
        <span className="ql-formats">
          <button className="ql-formula" title={ICON_LABELS_KANNADA.formula} />
          <button className="ql-code-block" title={ICON_LABELS_KANNADA.block} />
          <button className="ql-clean" title={ICON_LABELS_KANNADA.clean} />
        </span>
        <span className="ql-formats">
          <button className="ql-undo" title={ICON_LABELS_KANNADA.undo}>
            <UndoIcon />
          </button>
          <button className="ql-redo" title={ICON_LABELS_KANNADA.redo}>
            <RedoIcon />
          </button>
        </span>

        <span className="ql-formats">
          <FormControl>
            <InputLabel>ಪುಟದ ಗಾತ್ರ</InputLabel>
            <Select
              label="ಪುಟದ ಗಾತ್ರ"
              className="ql-page-size"
              value={pageSizeOption}
              onChange={handlePageSizeChange}
            >
              {Object.keys(PAGE_SIZES).map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </FormControl>
        </span>

        <span className="ql-formats">
          <button onClick={handleSpellcheck} className="ql-refresh-button">
            <RefreshIcon />
          </button>
        </span>
        <span className="ql-formats">
          <button
            onClick={handleVoiceToText}
            className="ql-voiceTotext"
            title={ICON_LABELS_KANNADA.voiceToText}
          >
            <SettingsVoiceIcon />
          </button>
        </span>
        <span className="ql-formats">
          <button
            onClick={handleZoomIn}
            className="ql-ZoomIn-button"
            title={ICON_LABELS_KANNADA.zoomIn}
          >
            <ZoomInIcon />
          </button>
        </span>
        <span className="ql-formats">
          <button
            onClick={handleZoomOut}
            className="ql-ZoomOut-button"
            title={ICON_LABELS_KANNADA.zoomOut}
          >
            <ZoomOutIcon />
          </button>
        </span>
        <span className="ql-formats">
          <button
            onClick={openSearchModal}
            className="ql-searchWord-button"
            title={ICON_LABELS_KANNADA.searchWord}
          >
            <ScreenSearchDesktopIcon />
          </button>
        </span>
        <span className="ql-formats">
          <button
            onClick={spellcheckInfo}
            className="ql-Spellcheck-button"
            title={ICON_LABELS_KANNADA.spellcheck}
          >
            <SpellcheckIcon fontSize="large" />
          </button>
        </span>
        <span className="ql-formats">
          <button className="ql-insert-table" title="insert table">
            <BackupTableIcon />
          </button>
        </span>

        <CustomSizeDialog open={openModal} onClose={handleCloseModal} onApply={applyCustomSize} />
      </div>

      <SearchModal
        isModalOpen={searchModal}
        closeModal={closeSearchModal}
        setSearchWord={setSearchWord}
        searchWord={searchWord}
        onSearch={handleFindword}
      />

      <InformationModal
        open={infoModalOpen}
        onClose={handleinfoCloseModal}
        title="ಮಾಹಿತಿ"
        message={message}
      />
    </>
  )
}

export default QuillToolbar
