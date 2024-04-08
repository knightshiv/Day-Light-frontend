import { DataGrid,gridClasses } from "@mui/x-data-grid";
import { Box, TextField, MenuItem , IconButton, useTheme,Button} from '@mui/material';
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { tokens } from '../../theme';
import { alpha, styled } from '@mui/material/styles';
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
//import { useDemoData } from '@mui/x-data-grid-generator';
import { Theme } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';



import { useState,useEffect,useRef } from "react";

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from '../../config/AuthAxios';

const ListParents = () => {

  const dataRef = useRef(null)
  const [data, setData] = useState([]);
  const [dataRow , setDataRow]= useState([]);
  const [searchText, setSearchText] = useState('');

  const [selectedValue, setSelectedValue] = useState([]);

  const [classValue, setClassValue] = useState(null);
  const [mediumValue, setMediumValue] = useState(null);

  const {userToken} = useAuth();
  const api = AuthAxios(userToken);
  const [loading, setLoading] = useState(true);


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    
   
   
  ];


  useEffect(() => {
    api.get('parents')
      .then((res) => {
        const data = res.data;
        const currentData = data.map((parent, index) => ({
          id: parent.id,
          name: parent.name,
          phone: parent.phone,
          email: parent.email,
        }));

        setDataRow(currentData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  
  
  const handleSearch = async event => {
    setLoading(true);
  
    const searchTerm = event.target.value.toLowerCase();
    setSearchText(searchTerm);
  
    const params = {};
    if (searchTerm.length > 0) {
      params.searchText = searchTerm; // Use searchTerm instead of searchText
    }
  
    api.get('parents', { params })
      .then((res) => {
        const data = res.data;
        setData(data);
  
        const currentData = data.map((parent, index) => ({
          ids: parent.id,
          id: index + 1,
          name: parent.name,
          phone: parent.phone,
          email: parent.email,
        }));
  
        setLoading(false);
  
        // Use setTimeout if you need a delay before setting the state
        setTimeout(() => {
          setDataRow(currentData);
          console.log("dataRow after mapping and setting state:", currentData);
        }, 100); // Adjust the delay time as needed
      })
      .catch((err) => {
        console.error(err);
      });
  };
  
  const ODD_OPACITY = 0.2;

  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: "white",
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
      '&.Mui-selected': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity,
        ),
        '&:hover, &.Mui-hovered': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY +
              theme.palette.action.selectedOpacity +
              theme.palette.action.hoverOpacity,
          ),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: alpha(
              theme.palette.primary.main,
              ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
          },
        },
      },
    },
  }));

  return (
    <div className="list">
      <div className="listContainer">
          <Box display="flex" alignItems="center" justifyContent="flex-start" mb={2}>
            <Box sx={{ mr: 2 }} variant="outlined" backgroundColor={colors.primary[400]} borderRadius="3px">
              <InputBase
                sx={{ ml: 2, flex: 1 }}
                placeholder="Search"
                onChange={handleSearch}
                style={{ width: '120px' }}
              />
              <IconButton type="button" sx={{ p: 1 }}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>

          <Box m="20px 0px 20px 0px"   sx={{
          '& .MuiDataGrid-root': {
            border: '4',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1',
          },
          
          '& .name-column--cell': {
            color: colors.primary[100],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: "#1890ff",
            borderBottom: '4',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '4',
            backgroundColor: "",
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[300]} !important`,
          },
          '& .MuiDataGrid-row': {
            backgroundColor: colors.primary[400],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-row.odd': {
            backgroundColor: "white",
            borderBottom: 'none',
          },
          
        }} height="600px">
          <DataGrid
            ref={dataRef}
            theme={theme}
            rows={dataRow}
            columns={columns}
            pageSize={5}
            disableRowSelectionOnClick
            loading={loading}
          />
        </Box>
      </div>
    </div>
  );
};

export default ListParents