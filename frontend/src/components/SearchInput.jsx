/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { filterUsers } from "../utils/backendRequest";

const SearchInput = ({
  setAllUsers,
  nametobeFiltered,
  setNameToBeFiltered,
}) => {
  useEffect(() => {
    filterUsers(nametobeFiltered).then((data) => {
      setAllUsers(data);
    });
  }, [nametobeFiltered]);

  return (
    <div className="SearchUserInput">
      <span className="material-symbols-outlined">search</span>
      <input
        type="text"
        placeholder="Search"
        value={nametobeFiltered}
        onChange={(e) => setNameToBeFiltered(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
