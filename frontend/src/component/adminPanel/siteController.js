import React from "react";
import ContentLoaderCompo from "../contentloader";
import GetLink from "../apiLink";
import { ToastContainer, toast } from "react-toastify";
class SiteController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: [],
      newSite: "",
      currentPage: 1,
      itemsPerPage: 10,
      editedSiteId: null,
      editedPromotionLink: "",
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchSites();
  }

  fetchSites() {
    fetch(GetLink() + "/programs")
      .then((response) => response.json())
      .then((sites) => {
        this.setState({ sites, loading: false });
      })
      .catch((error) => console.error("Error fetching sites:", error));
  }

  handleEditPromotionLink = (siteId, promotionLink) => {
    this.setState({ editedSiteId: siteId, editedPromotionLink: promotionLink });
  };

  handleSavePromotionLink = (siteId) => {
    const { editedPromotionLink } = this.state;
    console.log(siteId);
    if (editedPromotionLink) {
      fetch(`${GetLink()}/editPromotion/${siteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ promotionLink: editedPromotionLink }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            editedSiteId: null,
            editedPromotionLink: "",
          });
          toast.success(data.message);
        })
        .catch((error) =>
          console.error("Error updating promotion link:", error)
        );
    }
  };

  handleCancelEdit = () => {
    this.setState({ editedSiteId: null, editedPromotionLink: "" });
  };
  handlePromotionLinkChange = (event) => {
    this.setState({ editedPromotionLink: event.target.value });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const {
      sites,
      currentPage,
      itemsPerPage,
      editedSiteId,
      editedPromotionLink,
      loading,
    } = this.state;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sites.slice(indexOfFirstItem, indexOfLastItem);

    const siteRows = currentItems.map((site, index) => (
      <tr key={index}>
        <td>{site.name}</td>
        <td>
          {site.programId === editedSiteId ? (
            <input
              style={{ borderRadius: "5px", width: "400px" }}
              type="text"
              value={editedPromotionLink}
              onChange={this.handlePromotionLinkChange}
            />
          ) : (
            site.promotionLink
          )}
        </td>
        <td>
          {site.programId === editedSiteId ? (
            <>
              <button
                className="add-button1"
                onClick={() => this.handleSavePromotionLink(site.programId)}
              >
                Save
              </button>
              <button onClick={this.handleCancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              {!site.promotionLink && (
                <button
                  className="add-button1"
                  onClick={() =>
                    this.handleEditPromotionLink(
                      site.programId,
                      site.promotionLink
                    )
                  }
                >
                  Add
                </button>
              )}
              {site.promotionLink && (
                <button
                  className="add-button1"
                  onClick={() =>
                    this.handleEditPromotionLink(
                      site.programId,
                      site.promotionLink
                    )
                  }
                >
                  Edit
                </button>
              )}
            </>
          )}
        </td>
      </tr>
    ));

    const totalPages = Math.ceil(sites.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="main-content">
        {loading && <ContentLoaderCompo></ContentLoaderCompo>}
        <ToastContainer></ToastContainer>
        <section className="section">
          <div className="section-body">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h4>Promotion Site</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table
                        className="table table-striped dataTable no-footer"
                        style={{ textAlign: "initial" }}
                      >
                        <thead>
                          <tr>
                            <th>Prorgram Name</th>
                            <th>Promotion Site Link</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>{siteRows}</tbody>
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

export default SiteController;
