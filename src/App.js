import { Button, Grid, TextField } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import './App.css';
import { getLocalStorage, setLocalStorage } from './components/LocalStorage';
import TeamPlaysTable from './components/TeamPlaysTable';
import TeamsTable from './components/TeamsTable';

function App() {
	const [errorMessage, setErrorMessage] = useState('');
	const [validationPassed, setValidationPassed] = useState(true);
	const [reloadTable, setReloadTable] = useState(0);

	const validate = useCallback((validateOnChange) => {
		const newTeamName = document.getElementById('teamName').value;
		let error = false;

		if (newTeamName === '') {
			setErrorMessage('Team name cannot be empty');
			error = true;
		}

		const teams = getLocalStorage('teams');
		
		teams.forEach(team => {
			if (team.name === newTeamName) {
				setErrorMessage('Team already exists');
				error = true;
			}
		});

		setValidationPassed(!error);
		
		if (!error) {
			setErrorMessage('');
		}

		if (!validateOnChange && !error) {
			addNewTeam();
		}
	}, []);

	const addNewTeam = useCallback(() => {
		const teams = getLocalStorage('teams');

		let newTeam = {
			'name': document.getElementById('teamName').value,
			'played': 0,
			'win': 0,
			'draw': 0,
			'lost': 0,
			'points': 0,
		};

		teams.push(newTeam);

		setLocalStorage('teams', teams);
		document.getElementById('teamName').value = null;
		setReloadTable((oldVal) => oldVal + 1);
	}, []);

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Grid item xs={12} sm={8} justify="center" style={{ textAlign: 'center' }}>
					<TextField
						label="New team"
						id="teamName"
						error={!validationPassed}
						helperText={errorMessage}
						onChange={() => {
							validate(true)
						}}
					/>
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							validate(false);
						}}
						style={{marginLeft: '1rem', marginTop: '0.5rem'}}
					>
						Add
					</Button>
				</Grid>
			</Grid>
			<Grid container sm={12} justify="center" spacing={2}>
				<Grid item conatiner style={{overflowX: 'auto'}}>
					<TeamsTable
						reloadTable={reloadTable}
					/>
				</Grid>
				<Grid item conatiner style={{overflowX: 'auto'}}>
					<TeamPlaysTable
						reloadTable={reloadTable}
						setReloadTable={setReloadTable}
					/>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default App;
