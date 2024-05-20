'use client'
import { useEffect } from 'react';
const ClientScriptLoader = () => {
  useEffect(() => {
    (function(l, e, a, p) {
      if (window.Sprig) return;
      window.Sprig = function() { S._queue.push(arguments) };
      var S = window.Sprig;
      S.appId = a;
      S._queue = [];
      window.UserLeap = S;
      var s = l.createElement('script');
      s.async = 1 as any;
      s.src = e + '?id=' + S.appId;
      var p = l.getElementsByTagName('script')[0] as any
      p.parentNode.insertBefore(s, p);
    })(document, 'https://cdn.sprig.com/shim.js', process.env.NEXT_PUBLIC_SPROUT_ENVIRONMENT_ID);
  }, []);

  return null;
};

export default ClientScriptLoader;
