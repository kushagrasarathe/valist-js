import type { NextPage } from 'next';
import { useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import useSWRImmutable from 'swr/immutable';
import * as Icon from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useMediaQuery } from '@mantine/hooks';
import { Layout } from '@/components/Layout';
import { Metadata } from '@/components/Metadata';
import { Activity } from '@/components/Activity';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateAccount } from '@/components/CreateAccount';
import { CreateProject } from '@/components/CreateProject';
import { ValistContext } from '@/components/ValistProvider';
import { useDashboard } from '@/utils/dashboard';

import { 
  Title, 
  Group,
  Stack,
  Grid,
  Text,
  MediaQuery,
} from '@mantine/core';

import {
  AccountSelect,
  Actions,
  Action,
  Button,
  Card,
  CardGrid,
  InfoButton,
  ItemHeader,
  MemberStack,
  List,
  NoProjects,
  Welcome,
  CheckboxList,
} from '@valist/ui';

const IndexPage: NextPage = () => {
  const router = useRouter();
  const valist = useContext(ValistContext);

  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const [onboarding, setOnboarding] = useState(false);
  const [infoOpened, setInfoOpened] = useState(false);
  const showInfo = useMediaQuery('(max-width: 1400px)', false);

  const [accountName, setAccountName] = useState('');
  const { accounts, projects, members, logs, loading } = useDashboard(accountName);
  
  // reset account when address changes
  useEffect(() => {
    setAccountName('');
  }, [address]);

  const account: any = accounts.find((a: any) => a.name === accountName);
  const { data: accountMeta } = useSWRImmutable(account?.metaURI);

  const actions: Action[] = [
    {
      label: 'Settings', 
      icon: Icon.Settings, 
      href: `/-/account/${accountName}/settings`,
      variant: 'subtle',
      side: 'right',
    },
    {
      label: 'New Project',
      icon: Icon.News,
      href: `/-/account/${accountName}/create/project`,
      variant: 'primary',
      side: 'right',
    },
  ];

  const steps = [
    { label: 'Connect Wallet', checked: isConnected },
    { label: 'Create Account', checked: onboarding || accounts.length === 0 },
    { label: 'Create Project (Optional)', checked: false },
  ];

  if (!loading && (accounts.length === 0 || onboarding)) {
    return (
      <Layout hideNavbar>
        <Grid>
          <Grid.Col md={4}>
            <CheckboxList items={steps} />
          </Grid.Col>
          <Grid.Col md={8}>
            { !isConnected && 
              <Welcome button={
                <Button onClick={openConnectModal}>Connect Wallet</Button>
              } />
            }
            { isConnected && !onboarding && 
              <CreateAccount afterCreate={() => setOnboarding(true)} />
            }
            { isConnected && onboarding && 
              <CreateProject afterCreate={() => setOnboarding(false)} />
            }
          </Grid.Col>
        </Grid>
      </Layout>
    );
  }

  return (
    <Layout padding={0}>
      <Group mt={40} pl={40} position="apart">
        <AccountSelect
          name={accountName || 'All Accounts'}
          value={accountName}
          image={accountMeta?.image}
          href="/-/create/account"
          onChange={setAccountName}
        >
          <AccountSelect.Option value="" name="All Accounts" />
          {accounts.map((acc: any, index: number) => 
            <Metadata key={index} url={acc.metaURI}>
              {(data: any) => ( <AccountSelect.Option value={acc.name} name={acc.name} image={data?.image} /> )}
            </Metadata>,
          )}
        </AccountSelect>
        { showInfo &&
          <InfoButton 
            opened={infoOpened}
            onClick={() => setInfoOpened(!infoOpened)} 
          />
        }
      </Group>
      <div style={{ padding: 40 }}>
        { accountName !== '' &&
          <Group spacing={24} mb="xl" noWrap>
            <ItemHeader 
              name={accountName}
              label={accountMeta?.name}
              image={accountMeta?.image}
            />
            <Actions actions={actions} />
          </Group>
        }
        <Grid>
          { (!showInfo || !infoOpened) &&
            <Grid.Col xl={8}>
              { projects.length === 0 && 
                <NoProjects action={() => router.push(`/-/account/${accountName}/create/project`)} />
              }
              { projects.length !== 0 && 
                <CardGrid>
                  { projects.map((project: any, index: number) =>
                    <ProjectCard 
                      key={index}
                      name={project.name}
                      metaURI={project.metaURI}
                      href={`/${project.account?.name}/${project.name}`}
                    />,
                  )}
                </CardGrid>
              }
            </Grid.Col>
          }
          { (!showInfo || infoOpened) &&
            <Grid.Col xl={4}>
              <Stack spacing={24}>
                <Card>
                  <Stack spacing={24}>
                    <Title order={5}>Members</Title>
                    <MemberStack members={members} />
                  </Stack>
                </Card>
                <Card>
                  <Stack spacing={24}>
                    <Title order={5}>Recent Activity</Title>
                    <List>
                      {logs.slice(0, 4).map((log: any, index: number) => 
                        <Activity key={index} {...log} />,
                      )}
                    </List>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          }
        </Grid>
      </div>
    </Layout>
  );
};

export default IndexPage;