import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './libraryApp.css'
import './index.css'
import {LibraryApp} from "./libraryApp";
import {createLibraryUseCase} from "./infrastructure/factory";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LibraryApp useCase={createLibraryUseCase()} />
  </React.StrictMode>,
)
