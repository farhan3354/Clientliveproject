import React from "react";
import GetLink from "../apiLink";
class ProgramDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: props.show,
    };
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { program } = this.props;
    const { showModal } = this.state;

    if (!showModal) {
      return null; // Don't render the modal if showModal is false
    }

    return (
      <div
        className="modal fade show program_detail_modal"
        id={`modal-${program._id}`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby={`modal-${program._id}-label`}
        aria-hidden="true"
        style={{ display: "block", marginTop: "50px" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`modal-${program._id}-label`}>
                Program Details
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={this.handleCloseModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="f-div common_div">
                <p>Name: {program.name}</p>
                <p>Description: {program.description}</p>
              </div>
              <div className="s-div common_div">
                <p>Total Members: {program.totalMembers}</p>
                <p>Points: {program.points}</p>
              </div>
              <div className="t-div common_div">
                <p>Date Created : {program.dateCreated}</p>
              </div>

              {program.images[0] && <p>Images</p>}
              <div className="images">
                {GetLink() + "/" + program.images && (
                  <img
                    src={GetLink() + "/" + program.images}
                    width={100}
                    height={100}
                  ></img>
                )}
              </div>
              {/* Add other program details */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProgramDetailModal;
