import Home from "../container/Home";
import Navigation from "../container/Navigation";
import Pins from "../container/Pins";

export default function Index() {
  return (
    <Navigation>
      <Pins>
        <Home />
      </Pins>
    </Navigation>
  )
}
