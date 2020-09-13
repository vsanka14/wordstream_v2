import React, { useState, useMemo } from 'react';
import {
	ControlPanel,
	WordStream,
	Loader,
	Error,
	BarChart,
} from 'components/core';
import { IconContainer, Button } from 'components/styled';
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
	const dimensions = useMemo(() => [1200, 800], []);

	return (
		<div
			className={`
					w-screen h-screen
					bg-gray-900
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
					flex-1
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
									height: `${displayBarChart ? '50%' : '100%'}`
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
										top-0 right-0
										w-12 h-6
										${displayBarChart ? 'visible' : 'invisible'}
									`}
								> 
								<Button
									color="red"
									onClick={() => {
										setDisplayBarChart(false);
										setClearBrush(true);
									}}
								>
									<IconContainer> <IconX> </IconX> </IconContainer> 
								</Button>
								</div>
							</div>
							{displayBarChart
								? subGraphData && (
										<div
											className={`
												w-1/2
											`}
											style={{
												height: '50%',
											}}
										> 
											<BarChart data={subGraphData} wordsData={wordsData} brushRange={brushRange}/>
										</div>
								  )
								: null}
						</div>
					)
				)}
			</div>
		</div>
	);
}
