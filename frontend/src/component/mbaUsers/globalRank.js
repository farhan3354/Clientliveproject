import React, { useEffect, useState } from "react";
import ContentLoaderCompo from "../contentloader";
import GetLink from "../apiLink";
const GlobalRank = ({ id }) => {
  const [programDetails, setProgramDetails] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [topPoint, setTopPoint] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [programsPerPage] = useState(10);
  const [originalProgramDetails, setOriginalProgramDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = id;
  const [apiCall, setApiCall] = useState(GetLink() + "/globalRankMonthly");

  const handleApiCallChange = (event) => {
    const selectedOption = event.target.value;
    if (selectedOption === GetLink() + "/globalRankMonthly") {
      setApiCall(GetLink() + "/globalRankMonthly");
    } else if (selectedOption === GetLink() + "/globalRankYearly") {
      setApiCall(GetLink() + "/globalRankYearly");
    }
  };

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        let userid = userId;
        const response = await fetch(apiCall);
        if (response.ok) {
          const data = await response.json();

          if (apiCall.includes("globalRankMonthly"))
            setCurrentMonth(data.month + " " + data.year);
          else setCurrentMonth(data.year);

          setProgramDetails(data.rankings);
          setOriginalProgramDetails(data.rankings);
          let rank = 0;
          const matchedProgram = data.rankings.find((program) => {
            rank++;
            return program._id === userid;
          });
          setTopPoint(data.rankings[0].totalPoints);
          if (matchedProgram === undefined) {
            setCurrentUser({ rank: rank, points: 0 });
          } else
            setCurrentUser({ rank: rank, points: matchedProgram.totalPoints });
          setLoading(false);
        } else {
          console.error("Error fetching program details:", response.status);
        }
      } catch (error) {
        console.error("Error fetching program details:", error);
      }
    };
    fetchProgramDetails();
  }, [apiCall, userId]);
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
  const currentPrograms = programDetails.slice(
    indexOfFirstProgram,
    indexOfLastProgram
  );
  const pageNumbers = Math.ceil(programDetails.length / programsPerPage);
  const currentDate = new Date();
  const currentMonth2 = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const totalDaysInMonth = new Date(
    currentYear,
    currentMonth2 + 1,
    0
  ).getDate();
  let remainingDays = totalDaysInMonth - currentDate.getDate();
  if (apiCall !== GetLink() + "/globalRankMonthly") {
    remainingDays = 12 - currentMonth2;
  }
  return (
    <div className="main-content">
      {loading ? (
        <ContentLoaderCompo></ContentLoaderCompo>
      ) : (
        <section className="section">
          <div className="section-body">
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-header">
                    <h4>
                      {apiCall === GetLink() + "/globalRankMonthly"
                        ? `Global Monthly Reward Ranking - ${currentMonth}`
                        : `Global Yearly Reward Ranking - ${currentMonth}`}
                    </h4>
                  </div>
                  <div class="card-body p-0">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <tr>
                          <th>Current Rank</th>
                          <th>Current Points</th>
                          <th>Points Needed to be #1</th>
                          {apiCall === GetLink() + "/globalRankMonthly" ? (
                            <th>Days Left</th>
                          ) : (
                            <th>Month Left</th>
                          )}
                        </tr>
                        <tr>
                          <td>{currentUser !== null && currentUser.rank}</td>
                          <td>{currentUser !== null && currentUser.points}</td>
                          <td>
                            {currentUser !== null &&
                              (topPoint - currentUser.points !== 0
                                ? topPoint - currentUser.points
                                : "🥇")}
                          </td>

                          <td>{remainingDays}</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                          {currentPrograms.map((program, index) => {
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
                          <button
                            className="page-link"
                            onClick={handlePrevPage}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from(
                          { length: Math.min(3, pageNumbers) },
                          (_, i) => i + 1
                        ).map((number) => (
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
                        ))}
                        <li
                          className={`page-item ${
                            currentPage === pageNumbers ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={handleNextPage}
                          >
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
      )}
    </div>
  );
};

export default GlobalRank;
