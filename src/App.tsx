import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import MainLayout from "./routes/MainLayout"
import MainLayoutError from "./routes/MainLayoutError"
import { mainSelector } from "./routes/mainSlice"
import { useSelector } from "react-redux"
import "@cloudscape-design/global-styles/index.css"
import "./app.css"
import { Fragment } from "react"

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <MainLayoutError/>,
    children: [
      {
        path: "settings",
        lazy: () => import("./routes/settings/SettingsRoute"),
        handle: createCrumb("Settings", "/settings"),
      },
      {
        path: "transcribe",
        lazy: () => import("./routes/transcribe/SolflareSdkRoute"),
        handle: createCrumb("SolflareSdk", "/transcribe"),
      },
      {
        path: "upload-file",
        lazy: () => import("./routes/upload-file/DemoRoute"),
        handle: createCrumb("Upload File", "/upload-file"),
      },
      {
        path: "*",
        Component: () => <Navigate to="/transcribe"/>,
      }
    ],
  },
])

export interface CrumbHandle {
  crumbs: () => { crumb: string, path: string }
}

function createCrumb(crumb: string, path: string): CrumbHandle {
  return {
    crumbs: () => {
      return {
        crumb,
        path,
      }
    }
  }
}

export default function App() {
  const { lockScroll } = useSelector(mainSelector)

  return (
    <Fragment>
      <div
        id="test"
        style={lockScroll ? { height: "100%", position: "absolute", width: "100%", overflow: "hidden" } : {}}
      >
        <RouterProvider router={router} />
      </div>
      <div id="top-filler" />
    </Fragment>
  )
}
