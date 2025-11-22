import React from "react";
import ProgramDetailModal from "./ProgramDetail";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentLoaderCompo from "../contentloader";
import GetLink from "../apiLink";
class ModifyProgram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: [],
      currentPage: 1,
      programsPerPage: 10,
      searchValue: "",
      editMode: false,
      editedPoints: "",
      editedProgramId: "",
      programActive: null,
      loading: true,
      btnloading: false,
    };
  }

  handleEditClick = (id, points) => {
    this.setState({ editedProgramId: id });
    this.setState({ editMode: true });
    this.setState({ editedPoints: points });
  };

  handleSaveClick = (programId) => {
    const { editedPoints } = this.state;
    this.setState({ btnloading: true });
    fetch(`${GetLink()}/edit/${programId}/${editedPoints}`, {
      method: "PUT",
    })
      .then((response) => {
        if (response.ok) {
          this.setState({ btnloading: false });
          // Update the points in the state
          const { programs } = this.state;
          const updatedPrograms = programs.map((program) => {
            if (program.programId === programId) {
              return { ...program, points: editedPoints };
            }
            return program;
          });
          this.setState({
            programs: updatedPrograms,
            editMode: false,
            editedPoints: "",
          });
        } else {
          this.setState({ btnloading: false });
          throw new Error("Failed to update points");
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ btnloading: false });
      });
  };

  handleModal = (p) => {
    this.setState({ programActive: p });
  };

  componentDidMount() {
    // Fetch the programs from the backend
    fetch(GetLink() + "/programs")
      .then((response) => response.json())
      .then((programs) => {
        console.log(programs);
        this.setState({ programs, loading: false });
      })
      .catch((error) => console.error("Error fetching programs:", error));
  }

  handleDeleteProgram = (programId) => {
    confirmAlert({
      title: "Confirm",
      message:
        "Deleting this will vanish all users points. Still want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.setState({ btnloading: true });
            fetch(`${GetLink()}/deleteprogram/${programId}`, {
              method: "DELETE",
            })
              .then((response) => {
                if (response.ok) {
                  this.setState({ btnloading: false });
                  // Remove the deleted program from state
                  const programs = this.state.programs.filter(
                    (program) => program.programId !== programId
                  );
                  this.setState({ programs });
                  toast("Program deleted!", {
                    position: "top-right", // Position of the notification
                    autoClose: 5000, // Time in milliseconds before the notification automatically closes
                    hideProgressBar: false, // Whether to display a progress bar
                    closeOnClick: true, // Whether to close the notification when clicked
                    pauseOnHover: true, // Whether to pause the autoClose timer when hovered
                    draggable: true, // Whether the notification can be dragged
                    className: "color_green",
                  });
                } else {
                  this.setState({ btnloading: false });
                  throw new Error("Failed to delete program");
                }
              })
              .catch((error) => {
                console.error(error);
                this.setState({ btnloading: false });
              });
          },
        },
        {
          label: "No",
          onClick: () => {
            // Do nothing or handle cancellation
            // ...
          },
        },
      ],
    });
  };

  handleSearchChange = (event) => {
    this.setState({ searchValue: event.target.value });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleNextPage = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 });
  };

  handlePrevPage = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 });
  };

  render() {
    const { programs, currentPage, programsPerPage, searchValue, loading } =
      this.state;

    // Filter programs based on search value
    const filteredPrograms = programs.filter((program) =>
      program.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate pagination values
    const indexOfLastProgram = currentPage * programsPerPage;
    const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
    const currentPrograms = filteredPrograms.slice(
      indexOfFirstProgram,
      indexOfLastProgram
    );

    // Calculate total number of pages
    const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);

    // Calculate page numbers to display
    const maxPageNumbers = 10;
    let startPage = Math.max(1, currentPage - 5);
    let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    // Adjust startPage when endPage reaches the maximum number of pages
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);

    // Generate array of page numbers
    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return (
      <div className="main-content">
        {loading && <ContentLoaderCompo></ContentLoaderCompo>}
        <ToastContainer />
        <section className="section">
          <div className="section-body">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h4>Manage Program</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <div className="mb-3 tablesearch">
                        <input
                          type="text"
                          placeholder="Search by name"
                          value={searchValue}
                          onChange={this.handleSearchChange}
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
                              aria-label="Task Name: activate to sort column ascending"
                            >
                              Name
                            </th>
                            <th
                              className="sorting_disabled"
                              rowspan="1"
                              colSpan="1"
                              aria-label="Progress"
                            >
                              Total Members
                            </th>
                            <th
                              className="sorting_disabled"
                              rowspan="1"
                              colSpan="1"
                              aria-label="Members"
                            >
                              Points
                            </th>
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="table-1"
                              rowspan="1"
                              colSpan="1"
                              aria-label="Action: activate to sort column ascending"
                            >
                              Image
                            </th>
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="table-1"
                              rowspan="1"
                              colSpan="1"
                              aria-label="Action: activate to sort column ascending"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentPrograms.map((program, index) => (
                            <tr
                              key={program.programId}
                              role="row"
                              className={index % 2 === 0 ? "even" : "odd"}
                            >
                              <td className="sorting_1">{index + 1}</td>
                              <td>{program.name}</td>
                              <td>{program.totalMembers}</td>
                              <td>
                                {this.state.editMode &&
                                this.state.editedProgramId ===
                                  program.programId ? (
                                  <input
                                    type="number"
                                    value={this.state.editedPoints}
                                    onChange={(e) =>
                                      this.setState({
                                        editedPoints: e.target.value,
                                      })
                                    }
                                    style={{
                                      width: "50px",
                                      borderRadius: "5px",
                                    }}
                                  />
                                ) : (
                                  program.points
                                )}
                              </td>
                              <td>
                                <img
                                  src={GetLink() + "/" + program.images}
                                  width={50}
                                  height={50}
                                />
                              </td>
                              <td>
                                {this.state.editMode &&
                                this.state.editedProgramId ===
                                  program.programId ? (
                                  <button
                                    disabled={this.state.btnloading}
                                    className="btn btn-primary"
                                    onClick={() =>
                                      this.handleSaveClick(program.programId)
                                    }
                                  >
                                    Save
                                  </button>
                                ) : (
                                  <button
                                    disabled={this.state.btnloading}
                                    className="btn btn-primary"
                                    onClick={() =>
                                      this.handleEditClick(
                                        program.programId,
                                        program.points
                                      )
                                    }
                                  >
                                    Edit
                                  </button>
                                )}
                                <button
                                  disabled={this.state.btnloading}
                                  className="btn btn-danger"
                                  onClick={() =>
                                    this.handleDeleteProgram(program.programId)
                                  }
                                >
                                  Delete
                                </button>
                              </td>

                              {this.state.programActive === program && (
                                <ProgramDetailModal
                                  program={program}
                                  show={true}
                                />
                              )}
                              {/* {this.state.programActive == program && this.setState({programActive:null})} */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* {this.state.programActive != null && this.handleModal(null)} */}
                    <div className="paginationclass">
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={this.handlePrevPage}
                          >
                            Previous
                          </button>
                        </li>
                        {pageNumbers.map((number) => (
                          <li
                            key={number}
                            className={`page-item ${
                              currentPage === number ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => this.handlePageChange(number)}
                            >
                              {number}
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
                            onClick={this.handleNextPage}
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

export default ModifyProgram;
