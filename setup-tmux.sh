# detach from a tmux session if in one
session_name="baaka_io-anime"

if [ $(tmux ls | grep -c $session_name) ]; then
	echo "$session_name session already running"
else
	tmux new -d -s $session_name

	tmux rename-window code
	tmux send-keys "vi ." Enter

	tmux new-window -n server
	#begin backend
	tmux send-keys "cd ./backend" Enter
	tmux send-keys "npm run dev" Enter
	#end backend

	#Split window 
	#tmux split-window -v
	#tmux select-pane -t 0
	tmux select-window -t 1
	tmux attach-session -t $session_name
fi
