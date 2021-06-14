import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import { getLocalStorage } from '../LocalStorage';

const useStyles = makeStyles(() => ({
	tableContainer: {
		minWidth: '10rem',
		maxWidth: '40rem',
		maxHeight: '30rem',
		marginTop: '1rem',
	},
}));

export default function TeamsTable({reloadTable}) {
	const [data, setData] = useState([]);
	const classes = useStyles();

	const tableHeaders = [
		'Place',
		'Team',
		'Played',
		'Win',
		'Draw',
		'Lost',
		'Points',
	];

	// set data for teams table
	useEffect(() => {
		setData(getLocalStorage('teams'));
	}, [reloadTable]);

	return (
		<TableContainer component={Paper} className={classes.tableContainer}>
			<Table stickyHeader>
				<TableHead>
					{tableHeaders.map((header) => (
						<TableCell
							key={header}
							align="center"
						>
							{header}
						</TableCell>
					))}
				</TableHead>
				<TableBody>
					{data.map((d, index) => (
						<TableRow key={index}>
							<TableCell align="center">{index + 1}</TableCell>
							<TableCell align="center">{d.name}</TableCell>
							<TableCell align="center">{d.played}</TableCell>
							<TableCell align="center">{d.win}</TableCell>
							<TableCell align="center">{d.draw}</TableCell>
							<TableCell align="center">{d.lost}</TableCell>
							<TableCell align="center">{d.points}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}