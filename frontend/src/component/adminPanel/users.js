import React from "react";
import ProgramDetail from "./ProgramDetail";
import { Link } from "react-router-dom";
import ContentLoaderCompo from "../contentloader";
import GetLink from "../apiLink";
class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allusers: [],
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
      loading: true,
    };
  }

  componentDidMount() {
    // Fetch all users from the backend
    fetch(GetLink() + "/getallusers")
      .then((response) => response.json())
      .then((allusers) => {
        console.log(allusers[0]);
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
    this.setState({ currentPage: 1 });
  };

  render() {
    const { allusers, currentPage, itemsPerPage, searchQuery, loading } =
      this.state;

    // Filter users based on search query
    const filteredUsers = allusers.filter((user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total number of pages
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Calculate start and end page numbers for pagination
    const maxPageNumbers = 10;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    // Adjust startPage when endPage reaches the maximum number of pages
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);

    // Generate array of page numbers
    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    // Render table rows
    const tableRows = currentItems.map((user, index) => (
      <tr
        key={user._id}
        role="row"
        className={index % 2 === 0 ? "even" : "odd"}
      >
        <td className="sorting_1">{indexOfFirstItem + index + 1}</td>
        <td>{`${user.firstName} ${user.lastName}`}</td>
        <td>{user.dateCreated}</td>
      </tr>
    ));
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
                              User Name
                            </th>
                            <th
                              className="sorting_disabled"
                              rowspan="1"
                              colSpan="1"
                              aria-label="Date Joined"
                            >
                              Date Joined
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

export default Users;
