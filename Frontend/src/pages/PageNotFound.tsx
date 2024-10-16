import { Link } from "react-router-dom"

export const NotFound = () => {
  return (
    <>
      <div id="page-not-found" style={{ margin: "3rem" }}>
        Page Not Found
      </div>
      <Link to={"/"}>
        <button>Back</button>
      </Link>
    </>
  )
}
