import React, { useEffect, useState } from "react";
import ContentLoaderCompo from "../contentloader";
import GetLink from "../apiLink";
const Ranking = ({ match, id }) => {
  const [programDetails, setProgramDetails] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [programsPerPage] = useState(5);
  const [originalProgramDetails, setOriginalProgramDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = id;

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const response = await fetch(
          `${GetLink()}/program-detailwithpoints/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          const sortedPrograms = data.sort(
            (a, b) => b.programPoints - a.programPoints
          );

          setProgramDetails(sortedPrograms);
          setOriginalProgramDetails(sortedPrograms);
          setLoading(false);
        } else {
          console.error("Error fetching program details:", response.status);
        }
      } catch (error) {
        console.error("Error fetching program details:", error);
      }
    };

    fetchProgramDetails();
  }, [userId]);

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
      const filteredPrograms = originalProgramDetails.filter((program) =>
        program.name.toLowerCase().includes(searchValue.toLowerCase())
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

  return (
    <div className="main-content">
      {loading && <ContentLoaderCompo></ContentLoaderCompo>}
      <section className="section">
        <div className="section-body">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4>Program Ranking</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <div className="mb-3 tablesearch searcandtotal">
                      <h5>
                        Total Points :{" "}
                        {currentPrograms.reduce(
                          (acc, program) => acc + program.points,
                          0
                        )}
                      </h5>
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
                            Clicks On Link
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
                        {currentPrograms.map((program, index) => (
                          <tr
                            key={program._id}
                            role="row"
                            className={index % 2 === 0 ? "even" : "odd"}
                          >
                            <td className="sorting_1">{index + 1}</td>
                            <td>{program.name}</td>
                            <td>{program.clicks}</td>
                            <td>{program.points}</td>
                          </tr>
                        ))}
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

export default Ranking;
