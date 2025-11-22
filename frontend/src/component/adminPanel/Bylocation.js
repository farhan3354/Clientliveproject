import React from "react";
import ProgramDetail from "./ProgramDetail";
import { Link } from "react-router-dom";
import ContentLoaderCompo from "../contentloader";
import GetLink from "../apiLink";
class ByLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allusers: [],
      currentPage: 1,
      itemsPerPage: 100000,
      searchQuery: "",
      loading: true,
    };
  }

  componentDidMount() {
    // Fetch all users from the backend
    fetch(GetLink() + "/getallusers/location")
      .then((response) => response.json())
      .then((allusers) => {
        console.log(allusers);
        this.setState({ allusers, loading: false });
      })
      .catch((error) => console.error("Error fetching users:", error));
  }

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  handleSearch = (event) => {
    const query = event.target.value;
    this.setState({ searchQuery: query });
  };

  render() {
    const { allusers, currentPage, itemsPerPage, searchQuery, loading } =
      this.state;

    // Filter users based on search query
    const filteredUsers = allusers.filter((user) =>
      `${user.location}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total number of pages
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Calculate start and end page numbers for pagination
    const maxPageNumbers = 100;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    // Adjust startPage when endPage reaches the maximum number of pages
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);

    // Generate array of page numbers
    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    const tableRows = [];
    let i = 1;
    currentItems.forEach((city) => {
      tableRows.push(
        <tr key={city} className="city-row">
          <td>{i++}</td>
          <td>{city.location}</td>
          <td>{city.users}</td>
          <td>{city.clicks}</td>
        </tr>
      );
    });

    return (
      <div className="main-content">
        {loading && <ContentLoaderCompo></ContentLoaderCompo>}
        <section className="section">
          <div className="section-body">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h4>Users</h4>
                  </div>
                  <div className="card-body">
                    <div className="mb-3 tablesearch">
                      <input
                        type="text"
                        placeholder="Search"
                        onChange={this.handleSearch}
                      />
                    </div>
                    <div className="table-responsive">
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
                              rowspan="1"
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
                              rowspan="1"
                              colSpan="1"
                              aria-label="User Name: activate to sort column ascending"
                            >
                              Location
                            </th>
                            <th
                              className="sorting_disabled"
                              rowspan="1"
                              colSpan="1"
                              aria-label="Enrolled Programs"
                            >
                              MBA Count
                            </th>
                            <th
                              className="sorting_disabled"
                              rowspan="1"
                              colSpan="1"
                              aria-label="Points"
                            >
                              Traffic
                            </th>
                          </tr>
                        </thead>
                        <tbody>{tableRows}</tbody>
                      </table>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="pagination justify-content-center">
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              this.handlePageChange(currentPage - 1)
                            }
                          >
                            Previous
                          </button>
                        </li>
                        {pageNumbers.map((pageNumber) => (
                          <li
                            key={pageNumber}
                            className={`page-item ${
                              currentPage === pageNumber ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => this.handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              this.handlePageChange(currentPage + 1)
                            }
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
      </div>
    );
  }
}

export default ByLocation;
