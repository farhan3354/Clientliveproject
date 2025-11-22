import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader } from "../component/ui/card";
import { Button } from "../component/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emailSubmitCount, setEmailSubmitCount] = useState(0);
  const [pageExitCount, setPageExitCount] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/customers/${id}`)
      .then((response) => {
        setUser(response.data.customer);
        setEmailSubmitCount(response.data.emailSubmitCount);
        setPageExitCount(response.data.pageExitCount);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setError("Failed to load user details");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <Button variant="ghost" className="mb-4 flex items-center" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-5 h-5 mr-2 " /> Go Back
      </Button>
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <h3 className="text-2xl font-bold text-gray-900">User Details</h3>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="grid grid-cols-2 gap-4 text-gray-800">
              <p><strong>IP Address:</strong> {user.ip_address}</p>
              <p><strong>Device Type:</strong> {user.device_type}</p>
              <p><strong>Browser:</strong> {user.browser}</p>
              <p><strong>Country:</strong> {user.country}</p>
              <p><strong>City:</strong> {user.city}</p>
              <p><strong>Emails:</strong> {user.emails.join(", ")}</p>
              <p><strong>Visited URLs:</strong> {user.urls.join(", ")}</p>
              <p><strong>Time Spent:</strong> {user.time_spent} seconds</p>
              <p><strong>Email Submit Events:</strong> {emailSubmitCount}</p>
              <p><strong>Page Exit Events:</strong> {pageExitCount}</p>
            </div>
          ) : (
            <p className="text-gray-500">User not found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
