import "./App.css";

function App() {
  return (
    <div className="compact:w-full tablet:w-3/5 laptop:w-1/2 desktop:w-1/3 mx-auto flex h-dvh flex-col items-center justify-start overflow-x-hidden overflow-y-auto bg-blue-300">
      <div className="compact:px-4 mobile-lg:px-6 relative flex h-[27%] w-full flex-col justify-around bg-blue-300">
        1
      </div>
      <div className="bg-darker-blue-200 mx-auto h-[73%] w-[200%] flex-1 rounded-tl-2xl rounded-tr-2xl py-8 grid grid-cols-2">
        2
      </div>
    </div>
  );
}

export default App;
