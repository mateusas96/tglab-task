import React, { useEffect, useState } from 'react';
import { Table, TableCell, TableContainer, TableHead, Paper, TableBody, TableRow, Box } from "@material-ui/core";
import { getLocalStorage } from '../LocalStorage';

export default function TeamsTable(props) {
	const [data, setData] = useState([]);

	const tableHeaders = [
		'Place',
		'Team',
		'Played',
		'Win',
		'Draw',
		'Lost',
		'Points',
	];

	useEffect(() => {
		setData(getLocalStorage('teams'));
	}, [props.reloadTable]);

	return (
		<TableContainer component={Paper} className="tableContainer">
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