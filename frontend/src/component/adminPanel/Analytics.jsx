import CustomerTrackingLayout from '@/Layouts/CustomerTrackingLayout';
import { Head } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Analytics({ analytics }) {
    // Dummy data for RV page views
    const rvPageViewsData = [
        { name: 'Jan', pageViews: 1200, uniqueVisitors: 800, inquiries: 150 },
        { name: 'Feb', pageViews: 1400, uniqueVisitors: 950, inquiries: 180 },
        { name: 'Mar', pageViews: 1100, uniqueVisitors: 750, inquiries: 130 },
        { name: 'Apr', pageViews: 1600, uniqueVisitors: 1100, inquiries: 220 },
        { name: 'May', pageViews: 1800, uniqueVisitors: 1300, inquiries: 250 },
        { name: 'Jun', pageViews: 2000, uniqueVisitors: 1500, inquiries: 280 }
    ];

    // Most viewed RV categories
    const rvCategoryData = [
        { name: 'Class A', views: 2500 },
        { name: 'Class B', views: 1800 },
        { name: 'Class C', views: 2100 },
        { name: 'Travel Trailers', views: 3000 },
        { name: 'Fifth Wheels', views: 2300 }
    ];

    // User interaction data
    const interactionData = {
        gallery_views: 4500,
        spec_downloads: 850,
        inquiry_forms: 320,
        virtual_tours: 750,
        phone_clicks: 280,
        brochure_downloads: 420
    };

    // Popular RV features searched
    const featureSearchData = [
        { name: 'Bunkhouse', value: 30 },
        { name: 'Outdoor Kitchen', value: 25 },
        { name: 'Solar Ready', value: 20 },
        { name: 'Full-Time Living', value: 15 },
        { name: 'Luxury Features', value: 10 }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <CustomerTrackingLayout>
            <Head title="Customer Analytics" />

            {/* Header with Time Filter */}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="card-title mb-1">RV Customer Analytics</h4>
                                    <p className="text-muted">Track visitor behavior and engagement</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <select className="form-select">
                                        <option>Last 7 Days</option>
                                        <option>Last 30 Days</option>
                                        <option>Last 3 Months</option>
                                        <option>Last 6 Months</option>
                                        <option>Last Year</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Row */}
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="card radius-10">
                        <div className="card-body">
                            <h6 className="mb-0 text-muted">Total RV Views</h6>
                            <div className="d-flex align-items-center mt-2">
                                <div>
                                    <h4 className="mb-0">12,584</h4>
                                    <p className="mb-0 text-success"><i className="bx bx-up-arrow-alt"></i> +8.5%</p>
                                </div>
                                <div className="ms-auto text-primary">
                                    <i className="bx bx-car fs-3"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card radius-10">
                        <div className="card-body">
                            <h6 className="mb-0 text-muted">Inquiries Sent</h6>
                            <div className="d-flex align-items-center mt-2">
                                <div>
                                    <h4 className="mb-0">865</h4>
                                    <p className="mb-0 text-success"><i className="bx bx-up-arrow-alt"></i> +12.4%</p>
                                </div>
                                <div className="ms-auto text-info">
                                    <i className="bx bx-envelope fs-3"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card radius-10">
                        <div className="card-body">
                            <h6 className="mb-0 text-muted">Virtual Tours</h6>
                            <div className="d-flex align-items-center mt-2">
                                <div>
                                    <h4 className="mb-0">328</h4>
                                    <p className="mb-0 text-success"><i className="bx bx-up-arrow-alt"></i> +5.2%</p>
                                </div>
                                <div className="ms-auto text-warning">
                                    <i className="bx bx-video fs-3"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card radius-10">
                        <div className="card-body">
                            <h6 className="mb-0 text-muted">Brochure Downloads</h6>
                            <div className="d-flex align-items-center mt-2">
                                <div>
                                    <h4 className="mb-0">420</h4>
                                    <p className="mb-0 text-danger"><i className="bx bx-down-arrow-alt"></i> -2.8%</p>
                                </div>
                                <div className="ms-auto text-danger">
                                    <i className="bx bx-download fs-3"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Traffic Overview Graph */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Traffic Overview</h5>
                            <LineChart width={1200} height={300} data={rvPageViewsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="pageViews" stroke="#8884d8" name="Page Views" />
                                <Line type="monotone" dataKey="uniqueVisitors" stroke="#82ca9d" name="Unique Visitors" />
                                <Line type="monotone" dataKey="inquiries" stroke="#ffc658" name="Inquiries" />
                            </LineChart>
                        </div>
                    </div>
                </div>
            </div>

            {/* RV Categories and Features */}
            <div className="row mt-4">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Popular RV Categories</h5>
                            <BarChart width={700} height={300} data={rvCategoryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="views" fill="#8884d8" name="Views" />
                            </BarChart>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Most Searched Features</h5>
                            <PieChart width={300} height={300}>
                                <Pie
                                    data={featureSearchData}
                                    cx={150}
                                    cy={150}
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {featureSearchData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Interaction Metrics */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-4">User Interaction Breakdown</h5>
                            <div className="row g-3">
                                {Object.entries(interactionData).map(([key, value], index) => (
                                    <div className="col-md-4" key={key}>
                                        <div className="p-3 border rounded">
                                            <div className="d-flex align-items-center">
                                                <i className={`bx ${getIconForInteraction(key)} fs-3 me-2`}></i>
                                                <div>
                                                    <h6 className="mb-0">{formatInteractionLabel(key)}</h6>
                                                    <h5 className="mb-0">{value.toLocaleString()}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerTrackingLayout>
    );
}

// Helper functions for icons and labels
function getIconForInteraction(key) {
    const icons = {
        gallery_views: 'bx-images',
        spec_downloads: 'bx-download',
        inquiry_forms: 'bx-envelope',
        virtual_tours: 'bx-video',
        phone_clicks: 'bx-phone',
        brochure_downloads: 'bx-file'
    };
    return icons[key] || 'bx-question-mark';
}

function formatInteractionLabel(key) {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}