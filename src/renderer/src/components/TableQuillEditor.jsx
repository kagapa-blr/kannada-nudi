'use client'

import QuillBetterTable from 'quill-better-table' // Importing the better-table module for Quill
import QuillResizeImage from 'quill-resize-image' // Importing the image resize module for Quill
import React, { useEffect, useRef } from 'react' // Importing React and hooks
import ReactQuill,{Quill} from 'react-quill-new' // Importing the React wrapper for Quill
import 'react-quill-new/dist/quill.snow.css' // Importing default Quill Snow theme styles
import 'quill-better-table/dist/quill-better-table.css' // Importing styles for the better-table module

// Register custom Quill modules
Quill.register('modules/better-table', QuillBetterTable) // Registers the better-table module with Quill
Quill.register('modules/imageResize', QuillResizeImage) // Registers the image resize module with Quill

const QuillEditor = () => {
  const quillRef = useRef(null) // Creates a ref to access the ReactQuill instance


  // Handler to insert a table into the Quill editor
  const handleInsertTable = () => {
    const quill = quillRef.current?.getEditor() // Safely gets the Quill editor instance
    if (quill) {
      const tableModule = quill.getModule('better-table') // Gets the better-table module
      console.log('tableModule',tableModule)
      
      if (tableModule) {
        //console.log('Before table insertion:', quill.root.innerHTML) // Logs editor content before inserting the table
        tableModule.insertTable(3, 3) // Inserts a 3x3 table into the editor
        //console.log('After table insertion:', quill.root.innerHTML) // Logs editor content after inserting the table
      } else {
        console.log('Table module is not available.') // Handles the case where the module isn't registered
      }
    }


  }

  // Quill configuration modules
  const modules = {
    toolbar: {
      // Defines the toolbar structure
      container: [
        [{ header: [1, 2, 3, false] }], // Dropdown for headers
        ['bold', 'italic', 'underline', 'strike'], // Text formatting buttons
        [{ list: 'ordered' }, { list: 'bullet' }], // List options
        ['link', 'image'], // Buttons for links and images
        ['clean'], // Button to clear formatting
        ['insertTable'] // Custom button to insert a table
      ],
      handlers: {
        // Defines custom handlers for toolbar buttons
        insertTable: handleInsertTable // Links the custom insertTable handler to the toolbar button
      }
    },
    'better-table': {
      // Configuration for the better-table module
      operationMenu: {
        // Defines the context menu for table operations
        items: {
          unmergeCells: {
            text: 'Unmerge Cells' // Text for the unmerge cells menu item
          }
        }
      },
      columnResize: true, // Enables resizing table columns
      rowResize: true, // Enables resizing table rows
      rightClick: true // Enables right-click menu for tables
    },
    imageResize: {
      // Configuration for the image resize module
      parchment: Quill.import('parchment'), // Required for compatibility
      modules: ['Resize', 'DisplaySize', 'Toolbar'] // Enables resizing, display size, and toolbar functionality
    }
  }

  return (
    <div className="quill-editor">
      {/* ReactQuill editor with configured modules and a placeholder */}
      <ReactQuill
        ref={quillRef} // Attaches the quillRef to access the editor instance
        theme="snow" // Sets the editor theme to Snow
        modules={modules} // Passes the configured modules to the editor
        placeholder="Start writing here..." // Placeholder text
      />
    </div>
  )
}

export default QuillEditor
