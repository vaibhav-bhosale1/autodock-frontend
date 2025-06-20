import React, { useState, useEffect, useCallback } from 'react';

// You will no longer fetch from this URL for display purposes,
// but we'll keep it commented out for reference or if you re-enable later.
// const API_BASE_URL = 'http://54.226.97.70:5000';

function App() {
  const [status, setStatus] = useState(null);
  const [projects, setProjects] = useState([]);
  const [systemInfo, setSystemInfo] = useState(null);
  const [deployments, setDeployments] = useState({}); // Still needed for handleDeploy simulation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- HARDCODED STATIC DATA ---
  const staticStatus = {
    "status": "online",
    "deployments": {
      "total": 15,
      "successful": 12
    },
    "timestamp": new Date().toISOString()
  };

  const staticProjects = [
    {
      "id": "proj-123",
      "name": "Frontend Dashboard",
      "branch": "main",
      "status": "Deployed",
      "deployments": 5,
      "lastDeploy": "2025-06-19T10:00:00Z",
      "gitInfo": {
        "lastCommit": "a1b2c3d - Dashboard UI update"
      },
      "containerInfo": {
        "status": "running"
      }
    },
    {
      "id": "proj-456",
      "name": "Backend API Service",
      "branch": "develop",
      "status": "Failed",
      "deployments": 8,
      "lastDeploy": "2025-06-18T15:30:00Z",
      "gitInfo": {
        "lastCommit": "e4f5g6h - Fix auth bug"
      },
      "containerInfo": {
        "status": "stopped"
      }
    },
    {
      "id": "proj-789",
      "name": "Auth Microservice",
      "branch": "master",
      "status": "Building",
      "deployments": 2,
      "lastDeploy": "2025-06-20T09:45:00Z",
      "gitInfo": {
        "lastCommit": "i7j8k9l - Add user registration"
      },
      "containerInfo": {
        "status": "building"
      }
    }
  ];

  const staticSystemInfo = {
    "docker": {
      "running": true,
      "containerCount": 7,
      "autoDeploy": true
    },
    "github": {
      "active": true,
      "count": 4,
      "connected": true
    },
    "aws": {
      "connected": true,
      "publicIP": "54.226.97.70",
      "instanceId": "i-abcdef1234567890"
    },
    "system": {
      "hostname": "ec2-backend-server",
      "platform": "Linux",
      "cpuCount": 4,
      "freeMemory": "2.5GB",
      "totalMemory": "8GB",
      "uptime": 72000, // 20 hours
      "loadAverage": [0.65, 0.52, 0.48]
    },
    "lastUpdated": new Date().toISOString()
  };
  // --- END HARDCODED STATIC DATA ---


  // --- REMOVE OR COMMENT OUT ALL fetch* FUNCTIONS ---
  // These functions will no longer be called.
  /*
  const fetchStatus = async () => { /* ... original code ... * / };
  const fetchProjects = async () => { /* ... original code ... * / };
  const fetchSystemInfo = async () => { /* ... original code ... * / };
  */

  const fetchAllData = useCallback(async () => {
    // Instead of fetching, set the static data
    setStatus(staticStatus);
    setProjects(staticProjects);
    setSystemInfo(staticSystemInfo);
    setError(null); // Clear any previous error
    setLoading(false); // We are "loaded" immediately with static data
  }, []); // Dependencies array is empty as static data doesn't change

  useEffect(() => {
    fetchAllData();
    // No need for setInterval if data is static, but you can keep it
    // if you want to simulate a "refresh" of static data (e.g., timestamp)
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const handleDeploy = async (projectId) => {
    // --- SIMULATE DEPLOYMENT ---
    console.log(`Attempting to deploy project: ${projectId}`);
    // Simulate a successful API response after a short delay
    setDeployments(prevDeployments => ({
      ...prevDeployments,
      [projectId]: {
        message: `Deployment initiated (simulated) for project ${projectId}!`,
        deploymentId: `sim-dep-${Math.random().toString(36).substring(2, 9)}`
      }
    }));
    alert(`Simulated deployment for ${projectId}`);

    // Update the project status to "Building" temporarily, then "Deployed"
    setProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === projectId ? { ...p, status: 'Building' } : p
      )
    );

    setTimeout(() => {
      setProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === projectId ? { ...p, status: 'Deployed', lastDeploy: new Date().toISOString(), deployments: p.deployments + 1 } : p
        )
      );
      // Clear the deployment message after a while
      setTimeout(() => {
        setDeployments(prevDeployments => {
          const newDeployments = { ...prevDeployments };
          delete newDeployments[projectId];
          return newDeployments;
        });
      }, 5000); // Message disappears after 5 seconds
    }, 3000); // Simulate build time of 3 seconds
    // --- END SIMULATION ---
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'deployed':
      case 'running':
        return '#28a745';
      case 'building':
        return '#ffc107';
      case 'failed':
      case 'stopped':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  // Loading state will quickly resolve with static data
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 2s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <div>Loading system data...</div>
        </div>
      </div>
    );
  }

  // Error state should not be hit with static data, but keep for robustness
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>⚠️ Connection Error</h3>
          <p>{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchAllData();
            }}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      background: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <header style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 15px 0', color: '#333' }}>
          🐳 AutoDock Auto-Deploy System (Static Demo)
        </h1>
        {status && (
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            background: '#e9ecef',
            padding: '15px',
            borderRadius: '6px'
          }}>
            <span style={{ color: '#28a745', fontWeight: 'bold' }}>
              ✅ Status: Online
            </span>
            <span>
              📊 Total Deployments: {status.deployments?.total || 0}
            </span>
            <span>
              ✅ Success Rate: {status.deployments?.total > 0
                ? Math.round((status.deployments.successful / status.deployments.total) * 100)
                : 0}%
            </span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              Last Updated: {new Date(status.timestamp).toLocaleString()}
            </span>
          </div>
        )}
      </header>

      <main>
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>Projects</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {projects.map(project => (
              <div key={project.id} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h3 style={{ margin: 0, color: '#333' }}>{project.name}</h3>
                  <span style={{
                    background: getStatusColor(project.status),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {project.status}
                  </span>
                </div>

                <div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Branch:</strong> {project.branch}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Deployments:</strong> {project.deployments}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Last Deploy:</strong> {new Date(project.lastDeploy).toLocaleString()}
                  </p>
                  {project.gitInfo && (
                    <p style={{ margin: '5px 0' }}>
                      <strong>Last Commit:</strong> {project.gitInfo.lastCommit}
                    </p>
                  )}
                  {project.containerInfo && (
                    <p style={{ margin: '5px 0' }}>
                      <strong>Container:</strong> {project.containerInfo.status}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <button
                    onClick={() => handleDeploy(project.id)}
                    disabled={project.status === 'Building'}
                    style={{
                      background: project.status === 'Building' ? '#6c757d' : '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      cursor: project.status === 'Building' ? 'not-allowed' : 'pointer',
                      width: '100%'
                    }}
                  >
                    {project.status === 'Building' ? 'Building (Simulated)...' : 'Deploy (Simulated)'}
                  </button>
                </div>

                {deployments[project.id] && (
                  <div style={{
                    background: '#d4edda',
                    color: '#155724',
                    padding: '10px',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}>
                    <p style={{ margin: '0 0 5px 0' }}>
                      ✅ {deployments[project.id].message}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px' }}>
                      ID: {deployments[project.id].deploymentId}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>System Information</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>🐳 Docker Status</h4>
              {systemInfo?.docker ? (
                <>
                  <p style={{ margin: '5px 0', color: systemInfo.docker.running ? '#28a745' : '#dc3545' }}>
                    {systemInfo.docker.running ? '✅' : '❌'}
                    {systemInfo.docker.running ? 'Container Running' : 'Container Stopped'}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    📦 Active Containers: {systemInfo.docker.containerCount}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    🔄 Auto-deploy: {systemInfo.docker.autoDeploy ? 'Active' : 'Inactive'}
                  </p>
                </>
              ) : (
                <p style={{ color: '#dc3545' }}>❌ Docker info unavailable</p>
              )}
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>⚙️ GitHub Actions</h4>
              {systemInfo?.github ? (
                <>
                  <p style={{ margin: '5px 0', color: systemInfo.github.active ? '#28a745' : '#dc3545' }}>
                    {systemInfo.github.active ? '✅' : '❌'}
                    {systemInfo.github.active ? 'Workflows Active' : 'No Workflows'}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    📋 Workflow Files: {systemInfo.github.count}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    🔗 DockerHub: {systemInfo.github.connected ? 'Connected' : 'Not Connected'}
                  </p>
                </>
              ) : (
                <p style={{ color: '#dc3545' }}>❌ GitHub info unavailable</p>
              )}
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>☁️ AWS EC2</h4>
              {systemInfo?.aws ? (
                <>
                  <p style={{ margin: '5px 0', color: systemInfo.aws.connected ? '#28a745' : '#dc3545' }}>
                    {systemInfo.aws.connected ? '✅' : '❌'}
                    {systemInfo.aws.connected ? 'Instance Running' : 'Not on AWS'}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    🌐 Public IP: {systemInfo.aws.publicIP}
                  </p>
                  {systemInfo.aws.instanceId !== 'Unknown' && (
                    <p style={{ margin: '5px 0', fontSize: '12px' }}>
                      ID: {systemInfo.aws.instanceId}
                    </p>
                  )}
                </>
              ) : (
                <p style={{ color: '#dc3545' }}>❌ AWS info unavailable</p>
              )}
            </div>

            {systemInfo?.system && (
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>💻 System Metrics</h4>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  <strong>Hostname:</strong> {systemInfo.system.hostname}
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  <strong>Platform:</strong> {systemInfo.system.platform}
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  <strong>CPU Cores:</strong> {systemInfo.system.cpuCount}
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  <strong>Memory:</strong> {systemInfo.system.freeMemory} / {systemInfo.system.totalMemory}
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  <strong>Uptime:</strong> {formatUptime(systemInfo.system.uptime)}
                </p>
                {systemInfo.system.loadAverage && (
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>
                    <strong>Load Avg:</strong> {systemInfo.system.loadAverage.map(load => load.toFixed(2)).join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer style={{
        textAlign: 'center',
        marginTop: '40px',
        padding: '20px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: 0, color: '#666' }}>
          AutoDock Auto-Deploy System v1.0.0 | Built with ❤️ |
          {systemInfo?.system?.hostname && ` Running on ${systemInfo.system.hostname}`}
        </p>
        {systemInfo?.lastUpdated && (
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>
            System data last updated: {new Date(systemInfo.lastUpdated).toLocaleString()} (Static Data)
          </p>
        )}
      </footer>
    </div>
  );
}

export default App;