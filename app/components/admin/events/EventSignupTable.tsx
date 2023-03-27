import { Table, Header, HeaderRow, HeaderCell, Body, Row, Cell } from '@table-library/react-table-library';
import moment from 'moment';
import type { FC } from 'react';
import { useTheme } from '@table-library/react-table-library/theme';
import type { getEventWithAdminDetails } from '~/models/event.server';
import type { ArrayElement } from '~/utils';
import { downloadAsCsv} from '~/utils/csv-export'
import { Form, useSubmit } from '@remix-run/react';

type Event = NonNullable<Awaited<ReturnType<typeof getEventWithAdminDetails>>>

export function getNodes(event: Event) {
  return event.signups.map(s => {
    const node :Record<string, string|Date|boolean> & {id: string} = {
      id: s.id,
      name: s.participant.name,
      email: s.participant.email,
      signupTime: s.signupTime,
      validatedEmail: s.participant.validatedEmail
    }
    for (const sEIV of s.signupEventInputValues) { // custom fields
      node[sEIV.eventInputField.inputField.name] = sEIV.value;
    }
    return node
  })
}

export type Nodes = ReturnType<typeof getNodes>

export const handleDownloadCsv = (event: Event) => {
  const columns = [
    { accessor: (item: ArrayElement<Nodes>) => item.name, name: 'Name' },
    { accessor: (item: ArrayElement<Nodes>) => item.email, name: 'Email' },
    { accessor: (item: ArrayElement<Nodes>) => item.signupTime, name: 'Anmeldezeit' },
    { accessor: (item: ArrayElement<Nodes>) => item.validatedEmail, name: 'Email bestätigt' },
    ...event.eventInputFields.map(eIF => ({ // custom fields
      accessor: (item: ArrayElement<Nodes>) => item[eIF.inputField.name],
      name: eIF.inputField.name
    }))
  ];

  downloadAsCsv(columns, getNodes(event), `Anmeldungen ${event.name} - Stand ${moment().format('YYYY-MM-DD HH_mm')}`);
};

export const EventSignupTable:FC<{event: Event, editable: boolean}> = ({event, editable}) => {
  
  const submit = useSubmit()
  const nodes = getNodes(event)

  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: 40px 100px 250px 140px 100px ${new Array(event.eventInputFields.length + 1).join(' 200px')} minmax(200px, 1fr);
    `,
    BaseCell: `
      padding: 0.1rem 0.5rem;
      &:nth-of-type(1) {
        left: 0px;
      }
      &:nth-of-type(2) {
        left: 30px;
      }
    `,
  });

  const data = {nodes};

  return (
    <div className='p-2 rounded-md mt-2 bg-stone-700'>
    <Table data={data} theme={theme} layout={{custom: true, horizontalScroll: true }}>
      {(tableList) => (
        <>
          <Header>
            <HeaderRow className='bg-stone-700'>
              <HeaderCell pinLeft className='z-50'>i</HeaderCell>
              <HeaderCell pinLeft resize className='z-50'>Name</HeaderCell>
              <HeaderCell resize>Email</HeaderCell>
              <HeaderCell resize>Anmeldezeit</HeaderCell>
              <HeaderCell resize>Email bestätigt</HeaderCell>
              {event.eventInputFields.filter(eIF => !eIF.inputField.adminOnly).map(eIF => ( // custom participant fields
                <HeaderCell resize key={eIF.id}>{eIF.inputField.name}</HeaderCell>
              ))}
              {event.eventInputFields.filter(eIF => eIF.inputField.adminOnly).map(eIF => ( // custom adminOnly fields
                <HeaderCell resize key={eIF.id}>{eIF.inputField.name}</HeaderCell>
              ))}
              <HeaderCell className='z-50'>Löschen</HeaderCell>
            </HeaderRow>
          </Header>

          <Body>
            {tableList.map((item, i) => (
              <Row key={item.id} item={item} className='bg-stone-700'>
                <Cell pinLeft>{i+1}</Cell>
                <Cell pinLeft>{item.name}</Cell>
                <Cell>{item.email}</Cell>
                <Cell>
                  {moment(item.signupTime).format('DD.MM.YY HH:mm')}
                </Cell>
                <Cell>
                  <Form method='post' onChange={(e) => {submit(e.currentTarget)}}>
                    <input
                      type='checkbox'
                      defaultChecked={item.validatedEmail}
                      name='validatedEmail'
                      value='true'
                      disabled={!editable}
                    />
                    <input type='hidden' name='action' value='update-email-validation' />
                    <input type='hidden' name='signupId' value={item.id} />
                  </Form>
                </Cell>
                {event.eventInputFields.filter(eIF => !eIF.inputField.adminOnly).map(eIF => ( // custom fields
                  <Cell key={eIF.id}>{item[eIF.inputField.name]}</Cell>
                ))}
                {event.eventInputFields.filter(eIF => eIF.inputField.adminOnly).map(eIF => ( // custom adminOnly fields
                  eIF.inputField.typeId === 'checkbox' ? (
                    <Cell key={eIF.id}>
                      <Form method='post' onChange={(e) => {submit(e.currentTarget)}}>
                        <input
                          type='checkbox'
                          defaultChecked={item[eIF.inputField.name] === "true"}
                          name='value'
                          value='true'
                          disabled={!editable}
                        />
                        <input type='hidden' name='action' value='update-admin-only-checkbox' />
                        <input type='hidden' name='signupId' value={item.id} />
                        <input type='hidden' name='eventInputFieldId' value={eIF.id} />
                      </Form>
                    </Cell>
                  ) : (
                    <Cell>
                      <Form method='post' onChange={(e) => {submit(e.currentTarget)}}>
                      <input
                        type='text'
                        defaultValue={item[eIF.inputField.name]}
                        name='value'
                        className='text-sm text-stone-900 w-full'
                        disabled={!editable}
                      />
                      <input type='hidden' name='action' value='update-admin-only-text' />
                      <input type='hidden' name='signupId' value={item.id} />
                      <input type='hidden' name='eventInputFieldId' value={eIF.id} />
                    </Form>
                    </Cell>
                  )
                ))}
                
                <Cell>
                {editable && (
                  <Form method='post'>
                    <button
                      className='text-red-300'
                      type='submit'
                    >
                      Löschen
                    </button>
                    <input type='hidden' name='action' value='delete-signup' />
                    <input type='hidden' name='signupId' value={item.id} />
                  </Form>
                )}
                </Cell>
                
              </Row>
            ))}
          </Body>
        </>
      )}
    </Table>
    </div>
  );
};