// import axios from "axios";

import axios from "axios";
import fs from "fs";

export const getHospital = async (req, res) => {
  let success = false;
  try {
    const { date, searchString, limit } = req.query;

    const enteredDate = new Date(
      `${date.substring(6)}-${date.substring(3, 5)}-${date.substring(0, 2)}`
    );

    const currentDate = new Date();

    //checking for previous date
    if (enteredDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) {
      return res
        .status(400)
        .json({ success, message: " Previous date cannot be entered" });
    }

    //fetching data
    const queryURL = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=363&date=${date}`;
    const response = await axios.get(queryURL);
    const fetchedData = await response.data;
    const centers = fetchedData.centers;

    //filtering
    const newArray = centers.filter(function (e) {
      return e.name.match(RegExp(searchString, "i"));
    });

    const trimmedArray = newArray.slice(limit);

    const result = trimmedArray.map((e) => {
      return { center_id: e.center_id, name: e.name };
    });

    res.status(200).json({
      code: 200,
      message: "Hospitals sent successfully",
      result,
    });

    fs.writeFileSync(
      "hospitals.txt",JSON.stringify(result)
    );
  } catch (error) {
    console.log(error);
  }
};
