import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { Wifi, WifiOff, Sync } from '@mui/icons-material';

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isConnecting = false,
}) => {
  const getIcon = () => {
    if (isConnecting) {
      return <Sync sx={{ animation: 'spin 1s linear infinite' }} />;
    }
    return isConnected ? <Wifi /> : <WifiOff />;
  };

  const getLabel = () => {
    if (isConnecting) return 'Connecting...';
    return isConnected ? 'Connected' : 'Disconnected';
  };

  const getColor = (): 'success' | 'error' | 'warning' => {
    if (isConnecting) return 'warning';
    return isConnected ? 'success' : 'error';
  };

  const getTooltip = () => {
    if (isConnecting) return 'Connecting to real-time updates...';
    return isConnected 
      ? 'Connected to real-time updates' 
      : 'Not connected to real-time updates';
  };

  return (
    <Tooltip title={getTooltip()}>
      <Chip
        icon={getIcon()}
        label={getLabel()}
        color={getColor()}
        size="small"
        variant="outlined"
        sx={{
          mr: 2,
          color: 'white',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          '& .MuiChip-icon': {
            color: 'white',
          },
        }}
      />
    </Tooltip>
  );
};

export default ConnectionStatus;


