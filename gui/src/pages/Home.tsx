import { invoke } from '@tauri-apps/api';
import { ErrorContent } from 'components/ErrorContent';
import { Loading } from 'components/Loading';
import { LogPanel, RunPanel } from 'components/RunPanel';
import { STAT_INK } from 'constant';
import { usePromise } from 'hooks/usePromise';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { getConfig, getProfile } from 'services/config';
import { composeLoadable } from 'utils/composeLoadable';

export const Home: React.FC = () => {
  let { loading, error, retry, result } = composeLoadable({
    config: usePromise(getConfig),
    profile: usePromise(() => getProfile(0)),
  });
  const { t } = useTranslation();

  if (loading) {
    return <>
      <div className='h-full flex items-center justify-center'><Loading /></div>
    </>
  }

  if (error) {
    return <>
      <ErrorContent error={error} retry={retry} />
    </>
  }
  const gtoken = result?.profile.state.loginState?.gToken
  const onOpenSplatnet3 = async () => {
    await invoke('open_splatnet', {
      gtoken,
    })
  };


  return <div className='flex p-2 w-full h-full gap-2'>
    <div className='max-w-full h-full md:max-w-sm flex-auto'>
      <div className='flex flex-col gap-2 h-full'>
        <LogPanel className='sm:hidden flex-auto' />
        <RunPanel />
        <Link to='/settings' className='btn'>{t('设置')}</Link>
        <div className='flex gap-2 flex-auto-all'>
          <button className='btn' onClick={onOpenSplatnet3}>{t('打开鱿鱼圈3')}</button>
          <a className='btn' href={STAT_INK} target='_blank' rel='noreferrer'>{t('前往 stat.ink')}</a>
        </div>
      </div>
    </div>
    <LogPanel className='hidden sm:block flex-1' />
  </div>
}