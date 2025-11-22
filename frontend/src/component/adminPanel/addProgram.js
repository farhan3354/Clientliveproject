import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GetLink from "../apiLink";
class AddProgram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: null,
      images: "",
      imageFile: null,
      btnloading: false,
    };
  }

  showNotification = (message, type) => {
    this.setState({ notification: { message, type } });
    setTimeout(() => {
      this.setState({ notification: null });
    }, 3000); // Hide the notification after 3 seconds
  };

  resetFields = () => {
    document.getElementById("add-program-form").reset();
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ btnloading: true });
    console.log("here");
    // return;
    if (this.state.imageFile === null) {
      toast("Please add an image !", {
        position: "top-right", // Position of the notification
        autoClose: 5000, // Time in milliseconds before the notification automatically closes
        hideProgressBar: false, // Whether to display a progress bar
        closeOnClick: true, // Whether to close the notification when clicked
        pauseOnHover: true, // Whether to pause the autoClose timer when hovered
        draggable: true, // Whether the notification can be dragged
        className: "color_green",
      });
      this.setState({ btnloading: false });
      return;
    }

    // Get form data
    const name = event.target.elements.name.value;
    const points = event.target.elements.points.value;
    const description = event.target.elements.description.value;
    const promotionLink = event.target.elements.promotionLink.value;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("points", points);
    formData.append("description", description);
    formData.append("images", this.state.imageFile);
    formData.append("promotionLink", promotionLink);
    console.log(formData);
    console.log(this.state.imageFile);
    // return;

    // Send the payload to the server to add the program and upload images
    fetch(GetLink() + "/addprogram", {
      method: "POST",
      body: formData,
      // body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          this.resetFields(); // Reset the form fields
          toast("Program Added!", {
            position: "top-right", // Position of the notification
            autoClose: 5000, // Time in milliseconds before the notification automatically closes
            hideProgressBar: false, // Whether to display a progress bar
            closeOnClick: true, // Whether to close the notification when clicked
            pauseOnHover: true, // Whether to pause the autoClose timer when hovered
            draggable: true, // Whether the notification can be dragged
            className: "color_green",
          });

          this.setState({ btnloading: false });

          setTimeout(() => {
            this.props.setCurrclickFunc("manageProgram");
          }, 2000);
        }
        if (data.error) {
          this.setState({ btnloading: false });
          this.showNotification(data.error, "error");
        }
      })
      .catch((error) => {
        this.setState({ btnloading: false });
        console.error(error);
        // Handle the error here
      });
  };

  handleImagePreview = (event, imageNumber) => {
    const reader = new FileReader();
    const file = event.target.files[0];
    this.setState((prevState) => {
      return { imageFile: file };
    });
    reader.onloadend = () => {
      const imagePreview = reader.result;

      this.setState((prevState) => {
        // Create a new images array by updating the specific imagePreview
        const newImages = imagePreview; // Store the actual file in the images array

        return { images: newImages };
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  render() {
    return (
      <div className="main-content">
        <ToastContainer />
        <section className="section">
          <div className="card">
            <div className="card-body">
              <div className="col-lg-12">
                <form
                  onSubmit={this.handleSubmit}
                  id="add-program-form"
                  encType="multipart/form-data"
                >
                  {/* Form fields */}
                  <div className="card-header">
                    <h4>Program details.</h4>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>Program Name</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        name="name"
                        placeholder="Program Name*"
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label>Details</label>
                      <textarea
                        className="form-control"
                        name="description"
                        placeholder="Program details..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Program Points</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        name="points"
                        placeholder="Program Points*"
                      />
                    </div>
                    <div className="form-group">
                      <label>Promotion Link</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        name="promotionLink"
                        placeholder="Promotion Link*"
                      />
                    </div>
                    <div className="form-group">
                      <label>Program image</label>
                      <div className="form-group row mb-4">
                        <div className="col-sm-4 col-md-4">
                          <div id="image-preview" className="image-preview">
                            <label htmlFor="image-upload" id="image-label">
                              {this.state.images ? (
                                <img
                                  src={this.state.images}
                                  alt="Preview"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                  }}
                                />
                              ) : (
                                "Choose File"
                              )}
                            </label>
                            <input
                              type="file"
                              name="image1"
                              id="image-upload"
                              onChange={(e) => this.handleImagePreview(e, 1)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer text-right">
                    <button
                      disabled={this.state.btnloading}
                      className="btn btn-primary"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default AddProgram;
