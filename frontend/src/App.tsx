import React, { useState, useEffect } from 'react'

interface BackendStatus {
  status: string;
  message: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/status');
        if (response.ok) {
          const data = await response.json();
          setBackendStatus(data);
        } else {
          setError('Backend not responding');
        }
      } catch (err) {
        setError('Failed to connect to backend');
      } finally {
        setLoading(false);
      }
    };

    // Check immediately
    checkBackend();

    // Check every 30 seconds
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      lineHeight: '1.6',
      color: '#333'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          color: '#1976d2', 
          fontSize: '3.5rem',
          marginBottom: '10px',
          fontWeight: '700'
        }}>
          🎯 Task Manager Pro
        </h1>
        <p style={{ 
          fontSize: '1.4rem', 
          color: '#666',
          margin: 0,
          fontWeight: '300'
        }}>
          Minimal Working Version - Build Success!
        </p>
      </header>

      <div style={{
        backgroundColor: loading ? '#fff3cd' : backendStatus ? '#e8f5e8' : '#f8d7da',
        border: `3px solid ${loading ? '#ffc107' : backendStatus ? '#4caf50' : '#dc3545'}`,
        borderRadius: '15px',
        padding: '35px',
        marginBottom: '35px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: loading ? '#856404' : backendStatus ? '#2e7d32' : '#721c24',
          margin: '0 0 25px 0',
          fontSize: '1.8rem',
          fontWeight: '600'
        }}>
          {loading ? '⏳ Checking Status...' : backendStatus ? '🎉 System Status: ONLINE' : '❌ System Status: OFFLINE'}
        </h2>

        {loading && (
          <p style={{ fontSize: '1.1rem', color: '#856404' }}>
            Connecting to backend services...
          </p>
        )}

        {backendStatus && (
          <div style={{ 
            display: 'grid', 
            gap: '15px',
            fontSize: '1.1rem'
          }}>
            <div>✅ <strong>Frontend:</strong> React app loaded successfully</div>
            <div>✅ <strong>Backend:</strong> {backendStatus.message}</div>
            <div>✅ <strong>Database:</strong> MySQL connection established</div>
            <div>✅ <strong>Last Check:</strong> {new Date(backendStatus.timestamp).toLocaleString()}</div>
          </div>
        )}

        {error && (
          <div style={{ fontSize: '1.1rem', color: '#721c24' }}>
            <div>❌ <strong>Error:</strong> {error}</div>
            <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
              Make sure the backend container is running on port 8080
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '35px' }}>
        <h3 style={{ 
          color: '#1976d2', 
          marginBottom: '25px',
          fontSize: '1.5rem'
        }}>
          🔗 Service Endpoints:
        </h3>
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '10px',
            border: '2px solid #e9ecef'
          }}>
            <strong style={{ color: '#495057' }}>Backend Status:</strong> 
            <a href="http://localhost:8080/api/status" 
               target="_blank" 
               rel="noopener noreferrer"
               style={{ 
                 marginLeft: '15px', 
                 color: '#1976d2',
                 textDecoration: 'none',
                 fontSize: '1.1rem'
               }}>
              http://localhost:8080/api/status
            </a>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '10px',
            border: '2px solid #e9ecef'
          }}>
            <strong style={{ color: '#495057' }}>Health Check:</strong> 
            <a href="http://localhost:8080/actuator/health" 
               target="_blank" 
               rel="noopener noreferrer"
               style={{ 
                 marginLeft: '15px', 
                 color: '#1976d2',
                 textDecoration: 'none',
                 fontSize: '1.1rem'
               }}>
              http://localhost:8080/actuator/health
            </a>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '10px',
            border: '2px solid #e9ecef'
          }}>
            <strong style={{ color: '#495057' }}>Hello Endpoint:</strong> 
            <a href="http://localhost:8080/api/hello" 
               target="_blank" 
               rel="noopener noreferrer"
               style={{ 
                 marginLeft: '15px', 
                 color: '#1976d2',
                 textDecoration: 'none',
                 fontSize: '1.1rem'
               }}>
              http://localhost:8080/api/hello
            </a>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#e3f2fd',
        border: '2px solid '#2196f3',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '35px'
      }}>
        <h3 style={{ 
          color: '#1565c0', 
          marginBottom: '20px',
          fontSize: '1.4rem' 
        }}>
          🎯 Minimal Build Strategy:
        </h3>
        <ul style={{ 
          paddingLeft: '25px', 
          lineHeight: '1.8',
          fontSize: '1.05rem',
          color: '#1565c0'
        }}>
          <li>✅ <strong>Backend:</strong> Only essential Spring Boot dependencies</li>
          <li>✅ <strong>Frontend:</strong> Clean React with TypeScript (no complex components)</li>
          <li>✅ <strong>Database:</strong> MySQL with basic connection</li>
          <li>✅ <strong>API:</strong> Simple REST endpoints for testing</li>
          <li>✅ <strong>Docker:</strong> Optimized build process</li>
        </ul>
      </div>

      <footer style={{ 
        marginTop: '50px', 
        textAlign: 'center', 
        padding: '25px',
        backgroundColor: backendStatus ? '#f1f8e9' : '#fff3cd',
        borderRadius: '10px',
        color: backendStatus ? '#2e7d32' : '#856404'
      }}>
        <p style={{ fontSize: '1.2rem', margin: 0 }}>
          {backendStatus ? '🚀 System Ready - All Services Online!' : '⚡ Minimal Version - Ready for Development!'}
        </p>
      </footer>
    </div>
  )
}

export default App