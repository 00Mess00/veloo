import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["maps", "map"]

  connect() {
    this.mapsTarget.querySelector(`[id='0']`).style.visibility = "visible";
  }
  displayItinerary(e) {
    this.mapTargets.forEach(map => map.style.visibility="hidden");
    const mapItinerary = this.mapsTarget.querySelector(`[id='${e.currentTarget.id}']`);
    mapItinerary.style.visibility = "visible"
  }
}
