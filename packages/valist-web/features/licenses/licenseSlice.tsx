import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumberish } from 'ethers';
import { RootState } from '../../app/store';

export interface LicenseState {
  team: string;
  project: string;
  name: string;
  description: string;
  price: BigNumberish;
};

const initialState: LicenseState = {
  team: '',
  project: '',
  name: '',
  description: '',
  price: 0,
};

export const licenseSlice = createSlice({
  name: 'license',
  initialState,
  reducers: {
    setTeam: (state, action: PayloadAction<string>) => {
      state.team = action.payload;
    },
    setProject: (state, action: PayloadAction<string>) => {
      state.project = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setPrice: (state, action: PayloadAction<BigNumberish>) => {
      state.price = action.payload;
    },
  },
});

export const { 
  setTeam, setProject, setName, setDescription, setPrice,
} = licenseSlice.actions;
export const selectTeam = (state: RootState) => state.release.team;
export default licenseSlice.reducer;
