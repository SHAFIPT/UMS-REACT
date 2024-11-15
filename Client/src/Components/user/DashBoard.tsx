import './DashBord.css'
const DashBoard = () => {
  return (
    <div>
        <div className="wrapper flex justify-center items-center p-8 ">
            <div className="profile relative flex justify-center items-center bg-white w-[400px] h-[400px] mt-14 bg-cover cursor-pointer ">
                <div className="overLay w-[100%] h-[100%] rounded-[1px] cursor-pointer opacity-0 ">
                  <div className="about">
                    <h4>SHAFI </h4> <span>Software Developer</span>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DashBoard
