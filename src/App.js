import './App.css';
import React, { useCallback, useState } from 'react';
import { Box, Button, TableCell, TableContainer, TableRow, TextField, Table, TableBody } from '@material-ui/core';
import TeamsTable from './components/TeamsTable';
import { getLocalStorage, setLocalStorage } from './components/LocalStorage';
import TeamPlaysTable from './components/TeamPlaysTable';

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
		error ? null : setErrorMessage('');

		validateOnChange ? null : (!error ? addNewTeam() : null);
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
		document.getElementById('teamName').value = '';
		setReloadTable((oldVal) => oldVal + 1);
	}, []);

	return (
		<Box className="App">
			<Box className="App-header">
				<TableContainer>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>
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
								</TableCell>
								<TableCell></TableCell>
							</TableRow>
							<TableRow>
								<TableCell style={{width: '40rem'}}>
									<TeamsTable
										reloadTable={reloadTable}
									/>
								</TableCell>
								<TableCell>
									<TeamPlaysTable
										reloadTable={reloadTable}
										setReloadTable={setReloadTable}
									/>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Box>
	);
}

export default App;
