const ApprovalInput = ({ handler }: { handler: VoidFunction }) => (
  <>
    <label htmlFor="approval">Enter Login Approval Code:</label>
    <input
      type="text"
      name="approvalInput"
      id="approval"
      onKeyPress={({ key }) => key === "enter" && handler}
    />
  </>
);
