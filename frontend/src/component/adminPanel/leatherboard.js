import React, { useEffect, useState } from "react";
import ContentLoaderCompo from "../contentloader";
import GetLink from "../apiLink";
const LeadBoard = () => {
  const [programDetails, setProgramDetails] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [programsPerPage] = useState(10);
  const [originalProgramDetails, setOriginalProgramDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUrl = window.location.href;
  const userId = currentUrl.split("/")[currentUrl.split("/").length - 1];
  const [apiCall, setApiCall] = useState(GetLink() + "/globalRankMonthly");

  const handleApiCallChange = (event) => {
    const selectedOption = event.target.value;
    if (selectedOption === GetLink() + "/globalRankMonthly") {
      setApiCall(GetLink() + "/globalRankMonthly");
    } else if (selectedOption === GetLink() + "/globalRankYearly") {
      setApiCall(GetLink() + "/globalRankYearly");
    } else if (selectedOption === GetLink() + "/globalRankLastMonthly") {
      setApiCall(GetLink() + "/globalRankLastMonthly");
    }
  };

  useEffect(() => {
    console.log("here");
    setLoading(true);
    const fetchProgramDetails = async () => {
      try {
        const response = await fetch(apiCall);
        if (response.ok) {
          const data = await response.json();

          if (
            apiCall.includes("globalRankMonthly") ||
            apiCall.includes("globalRankLastMonthly")
          )
            setCurrentMonth(data.month + " " + data.year);
          else setCurrentMonth(data.year);
          console.log(data);
          setProgramDetails(data.rankings);
          setOriginalProgramDetails(data.rankings);
          setLoading(false);
        } else {
          console.error("Error fetching program details:", response.status);
        }
      } catch (error) {
        console.error("Error fetching program details:", error);
      }
    };
    fetchProgramDetails();
  }, [apiCall, currentUrl]);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < Math.ceil(programDetails.length / programsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
    if (e.target.value === "") {
      setProgramDetails(originalProgramDetails);
    } else {
      const filteredPrograms = originalProgramDetails.filter(
        (program) =>
          program.firstName
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          program.lastName.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setProgramDetails(filteredPrograms);
    }
  };
  // Pagination
  const indexOfLastProgram = currentPage * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  let currentPrograms = 0;
  console.log(programDetails.length);

  currentPrograms = programDetails.slice(
    indexOfFirstProgram,
    indexOfLastProgram
  );

  const pageNumbers = Math.ceil(programDetails.length / programsPerPage);

  return (
    <div className="main-content">
      {loading && <ContentLoaderCompo></ContentLoaderCompo>}
      <section className="section">
        <div className="section-body">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <div className="mb-3 tablesearch searcandtotal">
                      <select
                        style={{
                          padding: "6px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          fontSize: "16px",
                          width: "300px",
                        }}
                        value={apiCall}
                        onChange={handleApiCallChange}
                      >
                        <option value={GetLink() + "/globalRankMonthly"}>
                          Ranking for Monthly Reward
                        </option>
                        <option value={GetLink() + "/globalRankYearly"}>
                          Ranking for Yearly Reward
                        </option>
                        <option value={GetLink() + "/globalRankLastMonthly"}>
                          Ranking for Last Month
                        </option>
                      </select>
                      <input
                        type="text"
                        placeholder="Search by name"
                        value={searchValue}
                        onChange={handleSearchChange}
                        style={{
                          padding: "6px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          fontSize: "16px",
                          width: "300px",
                        }}
                      />
                    </div>
                    <table
                      className="table table-striped dataTable no-footer"
                      id="table-1"
                      role="grid"
                      aria-describedby="table-1_info"
                    >
                      <thead>
                        <tr role="row">
                          <th
                            className="text-center sorting_asc"
                            tabIndex="0"
                            aria-controls="table-1"
                            rowSpan="1"
                            colSpan="1"
                            aria-sort="ascending"
                            aria-label="#: activate to sort column descending"
                          >
                            #
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="table-1"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Task Name: activate to sort column ascending"
                          >
                            Name
                          </th>
                          <th
                            className="sorting_disabled"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Members"
                          >
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading &&
                          currentPrograms.map((program, index) => {
                            const isMatch = program._id === userId; // Assuming `userId` is the user's I
                            return (
                              <tr
                                key={program._id}
                                role="row"
                                className={`${
                                  index % 2 === 0 ? "even" : "odd"
                                } ${isMatch ? "matched" : ""}`}
                                style={{
                                  backgroundColor: isMatch ? "lightgreen" : "",
                                }}
                              >
                                <td className="sorting_1">
                                  {/* {indexOfFirstProgram + index + 1} */}
                                  {indexOfFirstProgram + index + 1 === 1
                                    ? " 🥇"
                                    : indexOfFirstProgram + index + 1 === 2
                                    ? " 🥈"
                                    : indexOfFirstProgram + index + 1 === 3
                                    ? "  🥉"
                                    : indexOfFirstProgram + index + 1}
                                </td>
                                <td>
                                  {program.firstName + " " + program.lastName}
                                </td>
                                <td>{program.totalPoints}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className="paginationclass">
                    <ul className="pagination">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button className="page-link" onClick={handlePrevPage}>
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: pageNumbers }, (_, i) => i + 1).map(
                        (number) => (
                          <li
                            key={number}
                            className={`page-item ${
                              currentPage === number ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(number)}
                            >
                              {number}
                            </button>
                          </li>
                        )
                      )}
                      <li
                        className={`page-item ${
                          currentPage === pageNumbers ? "disabled" : ""
                        }`}
                      >
                        <button className="page-link" onClick={handleNextPage}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeadBoard;
