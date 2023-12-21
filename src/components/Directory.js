import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function Directory() {
  const history = useHistory();
  const [userdata, setuserdata] = useState([]);

  useEffect(() => {
    getusers();
  }, []);

  const getusers = () => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        getposts(res.data);
      })
      .catch((err) => {});
  };

  const getposts = (userapidata) => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => {
        var postdata = res.data;
        for (var i = 0; i < userapidata.length; i++) {
          const filterBySearch = postdata.filter((item) => {
            if (item.userId === userapidata[i].id) {
              return item;
            }
          });
          userapidata[i].Post = filterBySearch;
        }
        setuserdata(userapidata);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="container mx-auto mt-8 ">
    <div className="flex justify-center items-center">

      <h1 className="text-2xl font-bold mb-4">Directory</h1>
    </div>
      <div className="flex flex-col space-y-4">
        {userdata.map((item) => (
          <div
            className="flex justify-between bg-gray-100 p-4 rounded-md cursor-pointer hover:bg-gray-300"
            key={item.id}
            onClick={() =>
              history.push({
                pathname: `/user/${item.id}`,
                state: item,
              })
            }
          >
            <p className="font-bold">Name: {item.name}</p>
            <p className="font-bold">Posts: {item.Post.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
