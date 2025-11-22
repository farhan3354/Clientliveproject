import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentLoaderCompo from "../contentloader";
import GetLink from "../apiLink";

class RewardsSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rewards: [],
      loading: true,
      user: null,
      notificationShown: false,
    };
  }

  componentDidMount() {
    const { id } = this.props;

    fetch(GetLink() + "/user/" + id)
      .then((response) => response.json())
      .then((data) => {
        if (data.notificationAtive === true && !this.state.notificationShown) {
          toast(data.notification, {
            position: "top-right",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "color_green",
          });

          this.setState({ notificationShown: true });

          fetch(`${GetLink()}/edituser/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ notificationAtive: false }),
          })
            .then((response) => response.json())
            .then((updatedData) => {})
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => console.error(error));

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

  render() {
    const { rewards, loading } = this.state;

    return (
      <div className="main-content">
        <ToastContainer />
        <h4 className="program_details_heading">Rewards</h4>
        {loading && <ContentLoaderCompo></ContentLoaderCompo>}
        {loading === false && rewards.length === 0 && (
          <div className="p_detail">No Reward Annouced yet</div>
        )}

        <div className="program_details">
          {rewards.map((reward) => (
            <div key={reward.id} className="p_detail">
              {!reward.image ? (
                ""
              ) : (
                <div className="program_images">
                  <img
                    src={`${GetLink()}/${reward.image}`}
                    alt={reward.rewardType}
                  />
                </div>
              )}

              <h4 className="program_name" style={{ padding: "5px 7px 0 7px" }}>
                {reward.rewardGift}
              </h4>
              <p style={{ padding: "5px 7px 0 7px", color: "#979595" }}>
                {reward.rewardType} Points
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default RewardsSection;
