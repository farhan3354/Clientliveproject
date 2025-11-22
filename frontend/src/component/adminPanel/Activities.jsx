import CustomerTrackingLayout from '@/Layouts/CustomerTrackingLayout';
import { Head } from '@inertiajs/react';

export default function Activities({ activities }) {
    // Dummy data for visitor activity
    const visitorData = {
        current_visitors: 45,
        total_today: 156,
        avg_session_duration: '4m 32s',
        bounce_rate: '32.4%',
    };

    // Dummy data for page visits
    const pageVisits = [
        {
            page: '/products/cars',
            visits: 245,
            avg_time: '2m 30s',
            bounce_rate: '25%',
        },
        {
            page: '/financing',
            visits: 180,
            avg_time: '3m 45s',
            bounce_rate: '30%',
        },
        {
            page: '/contact',
            visits: 120,
            avg_time: '1m 15s',
            bounce_rate: '45%',
        },
    ];

    // Dummy visitor details
    const visitorDetails = [
        {
            id: 1,
            ip: '192.168.1.1',
            location: 'New York, US',
            device: 'iPhone 12',
            browser: 'Safari',
            current_page: '/products/cars',
            time_spent: '5m 23s',
            pages_viewed: 4,
            last_activity: '2 minutes ago',
            status: 'Active',
        },
        {
            id: 2,
            ip: '192.168.1.2',
            location: 'London, UK',
            device: 'Desktop - Windows',
            browser: 'Chrome',
            current_page: '/financing',
            time_spent: '12m 45s',
            pages_viewed: 8,
            last_activity: '5 minutes ago',
            status: 'Active',
        },
        // Add more visitor details as needed
    ];

    return (
        <CustomerTrackingLayout>
            <Head title="Customer Activities" />

            {/* Real-time Overview Section */}
            <div className="row">
                {/* Main Overview Card */}
                <div className="col-12 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h4 className="card-title mb-0">Real-time Activity</h4>
                                    <small className="text-muted">Last updated 2 minutes ago</small>
                                </div>
                                <div className="d-flex align-items-center">
                                    <span className="pulse-dot me-2"></span>
                                    <span className="text-success">Live</span>
                                </div>
                            </div>

                            {/* Main Metrics */}
                            <div className="row g-4">
                                <div className="col-md-3">
                                    <div className="metric-card border-end">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="icon-box bg-primary-subtle me-2">
                                                <i className="bx bx-group text-primary"></i>
                                            </div>
                                            <h6 className="text-muted mb-0">Current Visitors</h6>
                                        </div>
                                        <div className="d-flex align-items-baseline">
                                            <h3 className="mb-0">{visitorData.current_visitors}</h3>
                                            <span className="badge bg-success-subtle text-success ms-2">
                                                <i className="bx bx-up-arrow-alt"></i> 12%
                                            </span>
                                        </div>
                                        <small className="text-muted">vs. 1 hour ago</small>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="metric-card border-end">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="icon-box bg-info-subtle me-2">
                                                <i className="bx bx-line-chart text-info"></i>
                                            </div>
                                            <h6 className="text-muted mb-0">Total Today</h6>
                                        </div>
                                        <div className="d-flex align-items-baseline">
                                            <h3 className="mb-0">{visitorData.total_today}</h3>
                                            <span className="badge bg-success-subtle text-success ms-2">
                                                <i className="bx bx-up-arrow-alt"></i> 8%
                                            </span>
                                        </div>
                                        <small className="text-muted">vs. yesterday</small>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="metric-card border-end">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="icon-box bg-warning-subtle me-2">
                                                <i className="bx bx-time text-warning"></i>
                                            </div>
                                            <h6 className="text-muted mb-0">Avg. Duration</h6>
                                        </div>
                                        <div className="d-flex align-items-baseline">
                                            <h3 className="mb-0">
                                                {visitorData.avg_session_duration}
                                            </h3>
                                            <span className="badge bg-danger-subtle text-danger ms-2">
                                                <i className="bx bx-down-arrow-alt"></i> 5%
                                            </span>
                                        </div>
                                        <small className="text-muted">vs. last week</small>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="metric-card">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="icon-box bg-danger-subtle me-2">
                                                <i className="bx bx-exit text-danger"></i>
                                            </div>
                                            <h6 className="text-muted mb-0">Bounce Rate</h6>
                                        </div>
                                        <div className="d-flex align-items-baseline">
                                            <h3 className="mb-0">{visitorData.bounce_rate}</h3>
                                            <span className="badge bg-success-subtle text-success ms-2">
                                                <i className="bx bx-down-arrow-alt"></i> 3%
                                            </span>
                                        </div>
                                        <small className="text-muted">vs. last week</small>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Metrics Row */}
                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                                        <div>
                                            <h6 className="mb-1">Most Active Page</h6>
                                            <p className="mb-0 text-primary">/products/cars</p>
                                        </div>
                                        <div className="text-end">
                                            <h5 className="mb-1">24 users</h5>
                                            <small className="text-success">Active now</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                                        <div>
                                            <h6 className="mb-1">Peak Time Today</h6>
                                            <p className="mb-0">2:00 PM - 3:00 PM</p>
                                        </div>
                                        <div className="text-end">
                                            <h5 className="mb-1">89 visitors</h5>
                                            <small className="text-muted">Peak count</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add these styles */}
            <style>
                {`
    .metric-card {
        padding: 1rem;
        height: 100%;
    }
    
    .icon-box {
        width: 35px;
        height: 35px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .icon-box i {
        font-size: 1.2rem;
    }
    
    .pulse-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #28a745;
        position: relative;
        display: inline-block;
    }
    
    .pulse-dot::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #28a745;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }

    .bg-primary-subtle { background-color: rgba(13, 110, 253, 0.1); }
    .bg-info-subtle { background-color: rgba(13, 202, 240, 0.1); }
    .bg-warning-subtle { background-color: rgba(255, 193, 7, 0.1); }
    .bg-danger-subtle { background-color: rgba(220, 53, 69, 0.1); }
    .bg-success-subtle { background-color: rgba(25, 135, 84, 0.1); }
`}
            </style>

            {/* Map Section */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Visitor Map</h4>
                            <div style={{ height: '400px', width: '100%' }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d19868.687191463536!2d-74.00597699999999!3d40.7127837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1639575231040!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Visitors Table */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Active Visitors</h4>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Location</th>
                                            <th>IP Address</th>
                                            <th>Device/Browser</th>
                                            <th>Current Page</th>
                                            <th>Time Spent</th>
                                            <th>Pages Viewed</th>
                                            <th>Last Activity</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visitorDetails.map((visitor) => (
                                            <tr key={visitor.id}>
                                                <td>{visitor.location}</td>
                                                <td>{visitor.ip}</td>
                                                <td>
                                                    {visitor.device} - {visitor.browser}
                                                </td>
                                                <td>{visitor.current_page}</td>
                                                <td>{visitor.time_spent}</td>
                                                <td>{visitor.pages_viewed}</td>
                                                <td>{visitor.last_activity}</td>
                                                <td>
                                                    <span className="badge bg-success">
                                                        {visitor.status}
                                                    </span>
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

            {/* Popular Pages Section */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Popular Pages</h4>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Page</th>
                                            <th>Visits</th>
                                            <th>Avg. Time</th>
                                            <th>Bounce Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageVisits.map((page, index) => (
                                            <tr key={index}>
                                                <td>{page.page}</td>
                                                <td>{page.visits}</td>
                                                <td>{page.avg_time}</td>
                                                <td>{page.bounce_rate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerTrackingLayout>
    );
}
