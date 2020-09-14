import React, { useState, useMemo, useEffect } from 'react';
import { ControlPanel, WordStream, BarChart, Details } from 'components/core';
import { IconContainer, Button, Loader, Error } from 'components/common';
import { IconX } from 'icons';

export default function App() {
	const [rawData, setRawData] = useState(null);
	const [subGraphData, setSubGraphData] = useState(null);
	const [displayBarChart, setDisplayBarChart] = useState(false);
	const [wordsData, setWordsData] = useState(null);
	const [wordStreamProcessing, setwordStreamProcessing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [brushRange, setBrushRange] = useState(null);
	const [clearBrush, setClearBrush] = useState(false);
	const [detailsData, setDetailsData] = useState(null);
	const dimensions = useMemo(() => [1200, 800], []);

	useEffect(() => {
		if (!subGraphData) return;
		setDetailsData(subGraphData[0]);
	}, [subGraphData, setDetailsData]);

	return (
		<div
			className={`
					w-screen h-screen
					flex flex-col md:flex-row
				`}
		>
			<div
				className={`
					w-full md:w-1/4 lg:w-1/5 md:h-full
					border border-blue-500
				`}
			>
				<ControlPanel
					setRawData={setRawData}
					setWordsData={setWordsData}
					setwordStreamProcessing={setwordStreamProcessing}
					setLoading={setLoading}
					setError={setError}
					dimensions={dimensions}
				/>
			</div>
			<div
				className={`
					relative
					flex-1 md:h-full
					text-white
        		`}
			>
				{loading || wordStreamProcessing ? (
					<>
						<div
							className={`
								absolute inset-0
								h-full w-full
								bg-gray-600
								opacity-25
							`}
						/>
						<Loader />
					</>
				) : null}
				{error ? (
					<Error />
				) : (
					wordsData && (
						<div
							className={`
								w-full h-full flex flex-col justify-center items-center
							`}
						>
							<div
								className={`
									w-full
								`}
								style={{
									height: `${displayBarChart ? '50%' : '100%'}`,
								}}
							>
								<WordStream
									displayBarChart={displayBarChart}
									setSubGraphData={setSubGraphData}
									setDisplayBarChart={setDisplayBarChart}
									rawData={rawData}
									wordsData={wordsData}
									dimensions={dimensions}
									setBrushRange={setBrushRange}
									brushRange={brushRange}
									clearBrush={clearBrush}
									setClearBrush={setClearBrush}
								/>
								<div
									className={`
										absolute
										inset-x-0 top-0
										w-full
										${displayBarChart ? 'visible' : 'invisible'}
										flex justify-start md:justify-end items-center
									`}
								>
									<div
										className={`
											w-12 h-6
										`}
									>
										<Button
											color="red"
											onClick={() => {
												setDisplayBarChart(false);
												setClearBrush(true);
											}}
										>
											<IconContainer>
												{' '}
												<IconX> </IconX>{' '}
											</IconContainer>
										</Button>
									</div>
								</div>
							</div>
							{displayBarChart ? (
								<div
									className={`
										w-full
										flex flex-col md:flex-row
									`}
									style={{
										height: '50%',
									}}
								>
									{subGraphData && (
										<div
											className={`
												w-full md:w-1/2 h-full
												p-2
											`}
										>
											<BarChart
												data={subGraphData}
												wordsData={wordsData}
												brushRange={brushRange}
												setDetailsData={setDetailsData}
												detailsData={detailsData}
											/>
										</div>
									)}
									{detailsData && (
										<div
											className={`
												w-full md:w-1/2 h-full
												p-2
											`}
										>
											<Details data={detailsData} />
										</div>
									)}
								</div>
							) : null}
						</div>
					)
				)}
			</div>
		</div>
	);
}
