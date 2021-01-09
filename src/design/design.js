import React from 'react';

import './themes/dark.css';
import 'css.gg/icons/all.css';
import './style/main.css';

import { CommandBoxManager, CommandBoxContextProvider, useCommandBox } from './components/commands/commands';
import { Flex } from './components/utils/flex';
import { Title } from './components/titles/title';
import { Quote } from './components/quotes/quote';
import { Table } from './components/tables/tables';
import { Button, Tag } from './components/buttons/buttons';
import { Modal } from './components/modals/modals';
import { Tabs } from './components/tabs/tabs';
import { SidebarLayout } from './components/sidebar/sidebar';
import { Uploader, FileUploader } from './components/uploader/uploader';
import { Separator } from './components/separators/separators';
import { Input } from './components/inputs/inputs';
import { Dropdown, Select } from './components/dropdowns/dropdowns';
import { Container, Box } from './components/containers/containers';
import { Toasts, useToast } from './components/toasts/toasts';
import { Checkbox, Radio, Toggle } from './components/checkables/checkables';
import { Drawer } from './components/drawer/drawer';

function Color({ name='white', color='fff' }) {
	const [ _color, setColor ] = React.useState(color);

	const changeColor = React.useCallback(({ target: { value }}) => {
		// Change css variable
		setColor(value);
	}, []);

	const slug = name.toLowerCase().split(' ').join('-');

	return (
		<React.Fragment>
			<style>
			{
				`
				:root {
					--${slug}: ${_color}
				}
				`
			}
			</style>
			<Box className="color-demo" style={{
				backgroundColor: _color
			}}>
				<span>{name}</span><br/><br/>
				<span>{_color}</span>
				<input type="color" value={_color} onChange={changeColor}/>
			</Box>
		</React.Fragment>
	);
}

function ModalDemo() {
	const [ open, setOpen ] = React.useState(false);
	return (
		<React.Fragment>
			<Box>
				<Button primary onClick={() => setOpen(true)}>Trigger!</Button>
			</Box>
			<Modal open={open} onClose={() => setOpen(false)}>
				<Title as='h3'>Modal</Title>
				This is a simple modal!
			</Modal>
		</React.Fragment>
	);
}

function DrawerDemo() {
	const [ open, setOpen ] = React.useState(false);
	return (
		<React.Fragment>
			<Box>
				<Button primary onClick={() => setOpen(!open)}>Drawer!</Button>
			</Box>
			<Drawer open={open} onClose={(arg) => {
				setOpen(false)
			}}>
				<Title as='h3'>Drawer</Title>
				This is a simple drawer!
			</Drawer>
		</React.Fragment>
	);
}

function TabDemo() {
	let [active, setActive] = React.useState(1);
	return (
		<React.Fragment>
			<Tabs centered>
				<Tabs.Tab disabled>First tab is disabled</Tabs.Tab>
				<Tabs.Tab active={active === 1} onClick={() => setActive(1)}>Second Tab</Tabs.Tab>
				<Tabs.Tab active={active === 2} onClick={() => setActive(2)}>Third tab</Tabs.Tab>
				<Tabs.Tab active={active === 3} onClick={() => setActive(3)}>Fourth tab</Tabs.Tab>
			</Tabs>

			<Tabs centered>
				<Tabs.Tab active={active === 2} onClick={() => setActive(2)}>Login</Tabs.Tab>
				<Tabs.Tab active={active === 3} onClick={() => setActive(3)}>Signup</Tabs.Tab>
			</Tabs>
		</React.Fragment>
	);
}

function Sidebar() {
	return "Hello";
}

function CommandButton() {
	const { setActions, override } = useCommandBox();
	return (
		<Button
			primary
			onClick={() => {
				override({
					actions: [{
						label: 'New action!',
						group: 'Group 1',
						onClick: () => {
							setActions([]);
						}
					}, {
						label: 'New global action',
						onClick: () => alert('Global!')
					}],
					context: {
						tags: ['plep']
					}
				});
			}}
		>
			Change actions!
		</Button>
	);
}

function ToastDemo() {
	const { success, error, warning, info, toast } = useToast();

	return (
		<div>
			<Button clear onClick={() => success('Success')}>Success</Button>
			<Button clear onClick={() => error('Error')}>Error</Button>
			<Button clear onClick={() => warning('Warning')}>Warning</Button>
			<Button clear onClick={() => info('Info')}>Info</Button>
			<Button clear onClick={() => toast('Toast')}>Toast</Button>
			<Button clear onClick={() => toast('Multiple actions!', {
				autodismiss: false,
				actions: [{
					text: 'Dismiss',
					onClick: (dismiss) => {
						dismiss()
					}
				}, {
					text: 'Undo',
					onClick: () => alert('UNDO!')
				}]
			})}>Multiple actions</Button>
			<Button clear onClick={() => toast('Single action', {
				actions: [{
					text: 'Lol',
					onClick: () => alert('Lol!')
				}]
			})}>Single action</Button>
			<Button clear onClick={() => success('With title and a very very long text that will probably not render in one div', {
				autodismiss: false,
				title: 'I won\'t autodismiss'
			})}>Toast with title</Button>
			<Button clear onClick={() => toast('Will alert on dismiss', {
				onDismiss: () => alert('Dismissed!')
			})}>Dismiss callback</Button>
		</div>
	);
}

export default function Design() {
	return (
		<CommandBoxContextProvider
			actions={[{
				label: 'Click me!',
				onClick: () => alert('Clicked!')
			},
			<div key="plep" onClick={() => alert('Clicked on jsx action!')}>POULET</div>,
			<div key="poulet"><div>Pplep</div></div>,
			{
				group: 1,
				label: 'Grouped action',
				icon: 'gg-arrow-down-r'
			},
			{
				group: 1,
				label: 'Grouped action 2',
				icon: 'gg-close-r'
			},
			{
				group: 1,
				label: 'Grouped action 2',
				icon: 'gg-album'
			},
			{
				group: 'Misc',
				label: 'Named group action'
			},
			{
				group: 'Misc',
				label: 'Same group action'
			},
			{
				group: 'Extra',
				label: 'Extra action'
			},
			{
				group: 'Extra',
				label: 'Extra action 2'
			}
		]}>
			<Toasts>
			<SidebarLayout Sidebar={Sidebar}>
				<CommandBoxManager/>
				<Container centered>
					<Title as="h1">
						Design
					</Title>

					<Title anchor="colors">
						Colors
					</Title>
					<Flex>
						<Color name='Dark' color='#0f111b'/>
						<Color name='Light Dark' color='#17191f'/>
						<Color name='Content' color='#1a1a23'/>
						<Color name='Accent' color='#2c2c77'/>
						<Color name='Medium Accent' color='#444398'/>
						<Color name='High Accent' color='#6d6bff'/>
					</Flex>
					<Flex>
						<Box className="color-demo bg-disabled">
							<span>Disabled</span><br/><br/>
						</Box>
						<Box className="color-demo bg-white-border">
							<span>White border</span><br/><br/>
						</Box>
					</Flex>
					<Flex>
						<Color name="Success content" color="#132f2a"/>
						<Color name="Success Accent" color="#127b69"/>
						<Color name="Success Light" color="#25c1a7"/>
						<Color name="Warning Content" color="#564d29"/>
						<Color name="Warning Accent" color="#d09f23"/>
						<Color name="Warning Light" color="#eac157"/>
						<Color name="Error Content" color="#561c1a"/>
						<Color name="Error Accent" color="#6d2523"/>
						<Color name="Error Light" color="#b13434"/>
					</Flex>


					<Separator>Inputs</Separator>
					<Title>
						Inputs
					</Title>
					<Box>
					<Input label="Username" placeholder="xxCrazyLordxx" type="text"/>
						<Input loading label="Search" placeholder="your search query" type="text"/>
						<Input icon="gg-alarm" label="Icon" placeholder="your search query" type="text"/>
						<Input required message="This field is required" label="Password" placeholder="Password" type="password"/>
						<Input error message="No spaces!!" label="Error" placeholder="username with spaces" type="text"/>
						<Input error required message="This is required" label="Error" placeholder="lol" type="text"/>
						<Input required warning message="Some warning!" label="Warning - Required" placeholder="oops" type="text"/>
						<Input required disabled label="Disabled" placeholder="Disabled"/>
					</Box>

					<Title as="h3">Simple</Title>
					<Box>
						<Input simple placeholder="Some other info" type="text"/>
						<Input simple placeholder="password" type="password"/>
						<Input simple icon="gg-bulb" placeholder="Icon"/>
						<Input simple loading placeholder="Loading"/>
					</Box>

					<Separator>Dropdowns</Separator>
					<Title>
						Dropdowns
					</Title>

					<Dropdown
						basic
						options={[{
							label: 'option1',
							value: 1
						}, {
							separator: 'OR'
						}, {
							label: 'hello',
							content: <Title>hello</Title>,
							value:2 
						}, {
							label: 'Poulet',
							value: 3
						}]}
					>
						<Button primary>Hover me!</Button>
					</Dropdown>

					<Dropdown
						basic
						clickable
						options={[{
							label: 'option1 neutral',
							value: 1,
							neutral: true
						}, {
							separator: 'OR'
						}, {
							label: 'hello',
							content: <Title>hello</Title>,
							value:2 
						}, {
							label: 'Poulet',
							value: 3
						}]}
					>
						<Button primary>Click on me and do not hover!</Button>
					</Dropdown>

					<Dropdown
						search
						clickable
						simple
						icon="gg-arrow-down-r"
						placeholder="Click on me and do not hover!"
						options={[{ label: 'option1', value: 1 }, { label: 'hello', content: <Title>hello</Title>, value:2 }]}
					/>

					<Dropdown
						basic
						options={[{
							label: 'option1',
							value: 1
						}, {
							separator: true
						}, {
							label: 'hello',
							content: <Title>hello</Title>,
							value:2 
						}, {
							label: 'Poulet',
							value: 3
						}]}
					>
						<Button primary small>Hover me!</Button>
					</Dropdown>

					<Dropdown
						basic
						options={[{ label: 'option1', value: 1 }, { label: 'hello', content: <Title>hello</Title>, value:2 }]}
					>
						<Input simple placeholder="Input in Dropdown!"/>
					</Dropdown>
					<br/>

					<Dropdown
						search
						label="Search something!"
						placeholder="Type your query here"
						options={[{ label: 'option1', value: 1 }, { label: 'hello', content: <Title>hello</Title>, value:2 }]}
					/>

					<Dropdown
						search
						simple
						icon="gg-arrow-down-r"
						placeholder="Search!"
						options={[{ label: 'option1', value: 1 }, { label: 'hello', content: <Title>hello</Title>, value:2 }]}
					/>

					<Dropdown>
						<Dropdown.Option label="Poulet"/>
						<Dropdown.Option separator/>
						<Dropdown.Option>
							<div> ITS A DIV </div>
						</Dropdown.Option>
						<Dropdown.Separator>
							Choose another
						</Dropdown.Separator>
						<Dropdown.Option>
							<Input simple placeholder="Type here!"/>
						</Dropdown.Option>
						<Input simple loading placeholder="Really complex dropdown"/>
					</Dropdown>

					<Dropdown
						clickable
					>
						<Dropdown.Option label="Poulet"/>
						<Dropdown.Option separator/>
						<Dropdown.Option>
							<div> ITS A DIV </div>
						</Dropdown.Option>
						<Dropdown.Option neutral>
							<div> neutral div </div>
						</Dropdown.Option>
						<Dropdown.Option neutral>
							<Input simple placeholder="neutral complex!"/>
						</Dropdown.Option>
						<Dropdown.Separator>
							Choose another
						</Dropdown.Separator>
						<Dropdown.Option>
							<Input simple placeholder="Type here!"/>
						</Dropdown.Option>
						<Input simple placeholder="Complex on Click"/>
					</Dropdown>

					<Select
						label="A select component"
						options={[
							{
								label: 'Select me!',
								value: 'selected-1'
							},
							{
								label: 'No me!',
								value: 'selected-2'
							},
							{
								label: 'Me me!',
								value: 'selected-3'
							}
						]}
						onChange={(val) => alert(val.value)}
						placeholder="Choose a value"
					/>

					<Select
						simple
						label="A select component"
						options={[
							{
								label: 'Select me!',
								value: 'selected-1'
							},
							{
								label: 'No me!',
								value: 'selected-2'
							},
							{
								label: 'Me me!',
								value: 'selected-3'
							}
						]}
						onChange={(val) => alert(val.value)}
						placeholder="Choose a value"
					/>


					<Separator/>
					<Title>
						Checkables
					</Title>
					<Box lifted>
						<Title as="h3">
							Checkboxes
						</Title>
						<p>
							Use in a form for many possible choices from a single category.
						</p>
						<Checkbox required label="Lableled checkbox"/>
						<Checkbox>Children checkbox</Checkbox>
						<Checkbox disabled label="Disabled checkbox"/>
						<Checkbox disabled checked label="Disabled checked"/>
						<Checkbox label="Message" message="This is a message"/>
						<Checkbox label="Errored box" error/>
						<Checkbox label="Errored box" error message="This is my error"/>
						<Checkbox label="Warning" warning message="This is a warning"/>
					</Box>
					<Box>
						<Title as="h3">
							Radios
						</Title>
						<p>
							Use in a form for one-in-many choices.
						</p>
						<Radio name="g1" label="Radio 1"/>
						<Radio name="g1" label="Radio 2"/>
						<Radio name="g1">children radio</Radio>
						<Radio name="g1" disabled>disabled radio</Radio>
						<Radio checked name="g2" disabled>disabled checked</Radio>

						<Radio name="g3" label="Message" message="This is a message"/>
						<Radio name="g3" label="Errored box" error/>
						<Radio name="g3" label="Errored box" error message="This is my error"/>
						<Radio name="g3" label="Warned box" warning message="This is a warning"/>
					</Box>
					<Box>
						<Title as="h3">
							Toggles
						</Title>
						<p>
							Use whenever auto-save actions are available. A toggle immediatly resolves.
						</p>
						<Toggle>Toggle me!</Toggle>
						<Toggle disabled>Disabled toggle</Toggle>

						<Toggle message="Poulet">With message</Toggle>
						<Toggle error>Errored</Toggle>
						<Toggle error message="Error message">Error message</Toggle>
						<Toggle warning message="Warning message">Warning!!</Toggle>
					</Box>


					<Separator/>
					<Title>
						Quotes
					</Title>
					<Quote>
						Hi! I'm an info quote
					</Quote>
					<Quote warning>
						Hi! I'm a warning quote
					</Quote>
					<Quote success>
						Hi! I'm a success quote
					</Quote>
					<Quote error>
						Hi! I'm an error quote
					</Quote>
					<Quote>
						<Title as="h3">Important</Title>
						Hi, I'm an important note!
					</Quote>
					<Quote error>
						<Title>Super Important</Title>
						Hi, I'm urgent!
					</Quote>


					<Separator/>
					<Title>
						Tables
					</Title>
					<p>Mobile friendy by default</p>
					<Box>
						<Table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Last Name</th>
									<th>Gender</th>
									<th>Approved</th>
									<th>Link</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Jo</td>
									<td>Colina</td>
									<td>Male</td>
									<td><Tag info primary>Check</Tag></td>
									<td>http://jocolina.com</td>
								</tr>
								<tr>
									<td>Name</td>
									<td>Last Name</td>
									<td>Gender</td>
									<td><Tag info pill success>Approved</Tag></td>
									<td>Link</td>
								</tr>
								<tr>
									<td>Name</td>
									<td>Last Name</td>
									<td>Gender</td>
									<td><Tag info pill danger>Declined</Tag></td>
									<td>Link</td>
								</tr>
								<Table.Tr selected>
									<td>Selected</td>
									<td>Row</td>
									<td>Selected</td>
									<td><Tag info primary>Row</Tag></td>
									<td>Selected</td>
								</Table.Tr>
							</tbody>
						</Table>
					</Box>


					<Separator>Buttons</Separator>
					<Title>
						Buttons
					</Title>
					<Box>
						<Button primary>Click me!</Button>
						<Button content={'Click me!'}/>
						<Button flat>Flat button</Button>
						<Button clear>Clear button</Button>
						<Button dark>Dark</Button>
						<Button danger>Stranger Danger</Button>
						<Button warning>Warning</Button>
						<Button primary loading>Loading...</Button>
						<br/>
						<Button small primary>Click me!</Button>
						<Button small content={'Click me!'}/>
						<Button small flat>Flat button</Button>
						<Button small clear>Clear button</Button>
						<Button small dark>Dark</Button>
						<Button small danger>Stranger Danger</Button>
						<Button small warning>Warning</Button>
						<Button small primary loading>Loading...</Button>
					</Box>

					<Title>
						Big buttons
					</Title>
					<Box>
						<Button big primary>Buy now!</Button>
						<Button big success>Transfer</Button>
						<Button big danger>Delete</Button>
					</Box>

					<Separator>Tags</Separator>
					<Title>
						Tags
					</Title>
					<Box>
						<Tag primary>Click me!</Tag>
						<Tag flat>Flat Tag</Tag>
						<Tag flat clearable>Flat clearable Tag</Tag>
						<Tag clear>Clear Tag</Tag>
						<Tag clear clearable>Clear Tag</Tag>
						<Tag dark>Dark</Tag>
						<Tag danger>Stranger Danger</Tag>
						<Tag primary clearable onClear={() => alert('Cleared!')}>Click me!</Tag>
						<Tag disabled>Click me!</Tag>
						<br/>
						<Tag info success>Success</Tag>
						<Tag info warning>Success</Tag>
						<Tag info danger>Success</Tag>
						<Tag info pill success>Pill</Tag>
						<Tag info pill warning>Pill</Tag>
						<Tag info pill danger>Pill</Tag>
					</Box>

					<Separator>Modals</Separator>
					<Title anchor="modals">
						Modals
					</Title>
					<ModalDemo/>
					<DrawerDemo/>

					<Separator>Tabs</Separator>
					<Title>
						Tabs
					</Title>
					<Tabs>
						<Tabs.Tab disabled>First tab is disabled</Tabs.Tab>
						<Tabs.Tab active>Second Tab</Tabs.Tab>
						<Tabs.Tab>Third tab</Tabs.Tab>
						<Tabs.Tab>Fourth tab</Tabs.Tab>
					</Tabs>
					<TabDemo/>

					<Separator>Uploader</Separator>
					<Title>
						Uploader
					</Title>
					<Uploader>I'm a simple uploader. Click to choose a file</Uploader>
					<FileUploader mimes={['application/pdf']}/>

					<Separator>Commands</Separator>
					<Title>
						Command Box
					</Title>
					<Box>
						Try pressing <kbd>Ctrl</kbd>+<kbd>K</kbd>
						<br/>
						<CommandButton/>
					</Box>

					<Separator>Toasts</Separator>
					<Title>
						Toasts
					</Title>
					<Box>
						<ToastDemo/>
					</Box>
				</Container>
			</SidebarLayout>
			</Toasts>
		</CommandBoxContextProvider>
	);
}
