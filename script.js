var educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
var countiesURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

/* importing data from url and converting it to js objects */
d3.json(countiesURL).then((data, error) => {
  if (error) {
    console.log(log);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;
    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        drawMap();
      }
    });
  }
});

var countyData;
var educationData;
var county;
var id;
var dataPercent;

var svgContainer = d3.select("#svgContainer");
var legend = d3.select("body");
var tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("visibility", "hidden")
  .style("position", "absolute")
  .style("width", 200)
  .style("height", 50);

var drawMap = () => {
  svgContainer
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (countyItem) => {
      console.log("countyItem", countyItem);
      id = countyItem["id"];
      county = educationData.find((item) => {
        return item["fips"] === id;
      });
      dataPercent = county["bachelorsOrHigher"];
      if (dataPercent <= 15) {
        return "red";
      } else if (dataPercent <= 30) {
        return "orange";
      } else if (dataPercent <= 45) {
        return "yellow";
      } else {
        return "green";
      }
    })
    .attr("data-fips", (countyItem) => {
      return countyItem["id"];
    })
    .attr("data-education", (countyItem) => {
      id = countyItem["id"];
      county = educationData.find((item) => {
        return item["fips"] === id;
      });
      dataPercent = county["bachelorsOrHigher"];
      return dataPercent;
    })
    .on("mouseover", (event) => {
      tooltip.transition().style("visibility", "visible");
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
      id = event.target.getAttribute("data-fips");
      county = educationData.find((item) => {
        return item["fips"] === Number(id);
      });
      tooltip.text(
        county["fips"] +
          " - " +
          county["area_name"] +
          ", " +
          county["state"] +
          ": " +
          county["bachelorsOrHigher"] +
          "%"
      );
      tooltip.attr("data-education", county["bachelorsOrHigher"]);
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });
};