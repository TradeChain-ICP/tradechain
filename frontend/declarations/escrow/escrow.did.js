export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'healthCheck' : IDL.Func(
        [],
        [IDL.Record({ 'status' : IDL.Text, 'timestamp' : IDL.Int })],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
