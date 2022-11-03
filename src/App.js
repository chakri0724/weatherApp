import logo from './logo.svg';
import './App.css';
import WeatherComponent from "./WeatherComponent";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          Weather App
      </header>
      <section>
          <WeatherComponent/>
      </section>
    </div>
  );
}

export default App;
