import React, { Component } from "react";
import ContentLoaderCompo from "../contentloader";
import GetLink from "../apiLink";
import { ToastContainer, toast } from "react-toastify";

class RewardsSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rewards: [],
      loading: true,
      newRewardType: "",
      newRewardGift: "",
      newRewardImage: null,
      btnloading: false,
    };
  }

  componentDidMount() {
    // Fetch rewards data from the backend
    fetch(GetLink() + "/rewards")
      .then((response) => response.json())
      .then((data) => {
        data = data.sort((a, b) => a.rewardType - b.rewardType);
        this.setState({
          rewards: data,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching rewards:", error);
      });
  }

  handleDeleteClick(id) {
    this.setState({ btnloading: true });
    // Make request to delete reward
    fetch(`${GetLink()}/deleteReward/${id}`, {
      method: "DELETE", // Change to the appropriate HTTP method for your backend
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ btnloading: false });
        if (data) {
          toast.success(data.message);
          // Update state to remove the deleted reward
          this.setState((prevState) => ({
            rewards: prevState.rewards.filter(
              (reward) => reward.rewardId !== id
            ),
          }));
        }
      })
      .catch((error) => {
        this.setState({ btnloading: false });
        console.error("Error deleting reward:", error);
      });
  }

  handleAddClick() {
    this.setState({ btnloading: true });
    const { newRewardType, newRewardGift, newRewardImage } = this.state;

    const formData = new FormData();
    formData.append("rewardType", newRewardType);
    formData.append("rewardGift", newRewardGift);
    if (newRewardImage) {
      formData.append("image", newRewardImage);
    }

    fetch(`${GetLink()}/addReward`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ btnloading: false });
        if (data) {
          this.setState({
            newRewardType: "",
            newRewardGift: "",
            newRewardImage: null,
          });
          toast.success(data.message);
          fetch(GetLink() + "/rewards")
            .then((response) => response.json())
            .then((data) => {
              data = data.sort((a, b) => a.rewardType - b.rewardType);
              this.setState({
                rewards: data,
                loading: false,
              });
            })
            .catch((error) => {
              console.error("Error fetching rewards:", error);
            });
        }
      })
      .catch((error) => {
        this.setState({ btnloading: false });
        console.error("Error adding reward:", error);
      });
  }
  render() {
    const { rewards, loading, newRewardType, newRewardGift } = this.state;

    return (
      <div className="main-content">
        {loading && <ContentLoaderCompo></ContentLoaderCompo>}
        <ToastContainer></ToastContainer>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="text-white">
                  <h4 className="mb-0 font-24">Rewards</h4>
                  <div style={{ display: "flex" }}>
                    <div>
                      <input
                        style={{ margin: "10px", padding: "2px 10px" }}
                        type="text"
                        placeholder="Points"
                        value={newRewardType}
                        onChange={(e) => {
                          const inputText = e.target.value;
                          const numericInput = inputText.replace(/[^0-9]/g, ""); // Allow only numbers
                          this.setState({ newRewardType: numericInput });
                        }}
                      />
                    </div>
                    <div>
                      <input
                        style={{
                          margin: "10px",
                          padding: "2px 10px",
                          width: "350px",
                        }}
                        type="text"
                        placeholder="Reward Gift"
                        value={newRewardGift}
                        onChange={(e) =>
                          this.setState({ newRewardGift: e.target.value })
                        }
                      />
                    </div>
                    <div style={{ width: "110px" }}>
                      <input
                        style={{ margin: "10px", padding: "1px 1px" }}
                        type="file"
                        name="rewardImage"
                        accept="image/*"
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          this.setState({
                            newRewardImage: selectedFile,
                            selectedFileName: selectedFile.name,
                          });
                        }}
                        placeholder="choose image"
                      />
                    </div>
                    <p style={{ margin: "10px", padding: "5px 1px" }}>
                      {this.state.selectedFileName}
                    </p>
                    <button
                      onClick={() => this.handleAddClick()}
                      className="add-button1"
                      style={{
                        width: "120px",
                        margin: "10px",
                        padding: "1px 1px",
                      }}
                    >
                      Add Reward
                    </button>
                  </div>
                  <table
                    className="table table-striped dataTable no-footer"
                    id="table-1"
                    role="grid"
                    aria-describedby="table-1_info"
                  >
                    <thead>
                      <tr>
                        <th>Points</th>
                        <th>Reward</th>
                        <th>Image</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rewards.map((reward) => (
                        <tr key={reward.id}>
                          <td>{reward.rewardType}</td>
                          <td>{reward.rewardGift}</td>
                          <td>
                            <img
                              src={GetLink() + "/" + reward.image}
                              width={50}
                              height={50}
                            />
                          </td>
                          <td>
                            <button
                              disabled={this.state.btnloading}
                              className="btn btn-danger"
                              onClick={() =>
                                this.handleDeleteClick(reward.rewardId)
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RewardsSection;
