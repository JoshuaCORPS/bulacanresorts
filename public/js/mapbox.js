export const displayMap = loc => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY29ycHMyNDMzIiwiYSI6ImNrNzJrYjdxdTAyemQzZ3FvdzQwb3ZmaWoifQ.mHF0PFYgnJAhDHRuUpPh4A';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/corps2433/ck7hasrw30xhe1ilvvzw0r891',
    center: [loc[0].coordinates[0], loc[0].coordinates[1]],
    zoom: 18
  });

  const bounds = new mapboxgl.LngLatBounds();

  loc.forEach(l => {
    // create a marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add the marker to the map
    new mapboxgl.Marker({
      // name of the created element
      element: el,
      // where the marker will be located in the exact location in the map
      anchor: 'bottom'
    })
      // set the longitude and latitude
      .setLngLat(l.coordinates)
      // add the lng, lat in the map to output
      .addTo(map);

    // Add popup messaage
    // offset: to not overlap the marker
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(l.coordinates)
      .setHTML(`<p> ${l.description} </p>`)
      .addTo(map);

    // Extend map to include current location
    bounds.extend(l.coordinates);
  });

  // map.fitBounds(bounds, {
  //   // padding: {
  //   //   top: 300,
  //   //   bottom: 300,
  //   //   left: 300,
  //   //   right: 300
  //   // }
  // });
};
