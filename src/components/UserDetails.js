import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import Popup from "./Popup";

var Pause = false;
var Timeobject = null;
var Timeobject2 = null;

export default function UserDetails() {
  const [userdata, setuserdata] = useState({});
  const [countrydata, setcountrydata] = useState([]);
  const [countryvalue, setcountryvalue] = useState("");
  const [countrytime, setTime] = useState("00:00:00");
  const [localtime, setlocaltime] = useState("00:00:00");
  const [visibility, setVisibility] = useState(false);
  const [popupheading, setpopupheading] = useState("");
  const [popupcontent, setpopupcontent] = useState("");

  const popupCloseHandler = () => {
    setVisibility(false);
  };

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setuserdata(location.state);
    getcountry();
    clearInterval(Timeobject2);

    const d = new Date();
    Timeobject2 = setInterval(function () {
      if (Pause === false) {
        d.setSeconds(d.getSeconds() + 1);
        setlocaltime(`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
      }
    }, 1000);
  }, []);

  const getcountry = () => {
    axios
      .get("http://worldtimeapi.org/api/timezone")
      .then((res) => {
        setcountrydata(res.data);
      })
      .catch((err) => {});
  };

  const handlechange = (e) => {
    var value = e.target.value;
    setcountryvalue(value);

    axios
      .get(`http://worldtimeapi.org/api/timezone/${value}`)
      .then((res) => {
        let Timestamp = res.data.datetime;
        var d;
        d = new Date(Timestamp.slice(0, 19));
        Pause = false;
        clearInterval(Timeobject);
        Timeobject = setInterval(function () {
          if (Pause === false) {
            d.setSeconds(d.getSeconds() + 1);
            setTime(`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
          }
        }, 1000);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const Pausetimer = () => {
    Pause = !Pause;
  };

  return (
    <div className="ml-2  ">
      <div className="flex justify-end">
        <div>
          <button
            className="backbtn  pr-5 mr-[1400px]  py-2 px-2 mt-2 bg-blue-400 hover:bg-blue-700 text-white font-bold rounded"
            onClick={() => history.push("/")}
          >
            Back
          </button>
        </div>
        <div className="countrycardcol pt-1">
          <select
            className="dropdown border rounded p-2"
            onChange={handlechange}
            value={countryvalue}
          >
            <option value="" disabled>
              Select Country
            </option>
            {countrydata.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>

          {countryvalue !== "" ? (
            <span className="timer">{countrytime}</span>
          ) : (
            <span className="timer">{localtime}</span>
          )}

          <button
            className="pausebtn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={Pausetimer}
          >
            Pause/Start
          </button>
        </div>
      </div>

      <h1 className="heading  flex justify-center items-center text-3xl font-bold mb-4">
        Profile Page
      </h1>

      {Object.keys(userdata).length > 0 ? (
        <>
        <div className="profilecard pl-[200px] bg-gray-200 p-4 mb-4 grid grid-cols-2 rounded-md">
  <div>
    <p>
      <b>Name:</b> {userdata.name}
      <br />
      <b>Username | Catch phrase:</b> {userdata.username} |
      {userdata.company.catchPhrase}
    </p>
  </div>
  <div>
    <p>
      <b>Address:</b> {userdata.address.suite} {userdata.address.street}
      {userdata.address.city} {userdata.address.zipcode}
      <br />
      <b>Email | Phone:</b> {userdata.email} | {userdata.phone}
    </p>
  </div>
</div>


          <div className="postcardrow">
            {userdata.Post?.map((item) => (
              <div className="postcardcol" key={item.id}>
                <div
                  className="postcard bg-blue-200 p-4 mb-4 rounded-md cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setVisibility(true);
                    setpopupheading(item.title);
                    setpopupcontent(item.body);
                  }}
                >
                  <h1 className="text-xl font-bold">{item.title}</h1>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <Popup onClose={popupCloseHandler} show={visibility}>
        <h1 className="text-2xl font-bold mb-2">{popupheading}</h1>
        <p>{popupcontent}</p>
      </Popup>
    </div>
  );
}
